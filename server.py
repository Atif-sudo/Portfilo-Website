import json
import mimetypes
import os
import sqlite3
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib import error, request

ROOT = Path(__file__).resolve().parent
PORT = int(os.getenv('PORT', '3000'))
DB_PATH = ROOT / 'portfolio.db'


def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            '''
            CREATE TABLE IF NOT EXISTS portfolio_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            '''
        )
        conn.commit()


def load_env_file():
    env_path = ROOT / '.env'
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding='utf-8').splitlines():
        line = raw_line.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue

        key, value = [part.strip() for part in line.split('=', 1)]
        if key and not os.getenv(key):
            os.environ[key] = value.strip('"').strip("'")


load_env_file()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
OPENAI_MODEL = os.getenv('OPENAI_MODEL', 'gpt-4o-mini')
OPENAI_BASE_URL = os.getenv('OPENAI_BASE_URL', 'https://api.openai.com/v1')


class PortfolioHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        return

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/health':
            self._send_json({'status': 'ok'})
            return

        file_path = self._resolve_path(self.path)
        if file_path is None:
            self._send_error(404, 'Not found')
            return

        self._serve_file(file_path)

    def do_POST(self):
        if self.path == '/api/contact':
            self._handle_contact_submission()
            return

        if self.path != '/api/chat':
            self._send_error(404, 'Not found')
            return

        content_length = int(self.headers.get('Content-Length', '0'))
        raw_body = self.rfile.read(content_length)

        try:
            payload = json.loads(raw_body.decode('utf-8') or '{}')
        except json.JSONDecodeError:
            self._send_error(400, 'Invalid JSON payload')
            return

        message = str(payload.get('message', '')).strip()
        if not message:
            self._send_error(400, 'Message is required.')
            return

        if not OPENAI_API_KEY:
            self._send_json({
                'reply':
                    'The live AI assistant is ready, but the server is missing an API key. Add OPENAI_API_KEY to a .env file to enable real AI responses.'
            })
            return

        body = {
            'model': OPENAI_MODEL,
            'temperature': 0.7,
            'messages': [
                {
                    'role': 'system',
                    'content':
                        'You are Alex Carter, a web developer and UI designer. Respond as a helpful portfolio assistant for a professional website. Keep answers concise, confident, and relevant to design, web development, project work, and collaboration.'
                },
                {'role': 'user', 'content': message}
            ]
        }

        api_url = f"{OPENAI_BASE_URL.rstrip('/')}/chat/completions"
        api_request = request.Request(
            api_url,
            data=json.dumps(body).encode('utf-8'),
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {OPENAI_API_KEY}'
            },
            method='POST'
        )

        try:
            with request.urlopen(api_request, timeout=30) as response:
                result = json.loads(response.read().decode('utf-8'))
        except error.HTTPError as exc:
            api_error = exc.read().decode('utf-8', errors='replace')
            try:
                parsed_error = json.loads(api_error)
                detail = parsed_error.get('error', {}).get('message', api_error)
            except json.JSONDecodeError:
                detail = api_error
            self._send_json({'error': 'AI request failed.', 'details': detail}, status=500)
            return
        except Exception as exc:
            self._send_json({'error': 'AI request failed.', 'details': str(exc)}, status=500)
            return

        reply = result.get('choices', [{}])[0].get('message', {}).get('content', '').strip()
        if not reply:
            self._send_json({'error': 'The model returned an empty response.'}, status=500)
            return

        self._send_json({'reply': reply})

    def _handle_contact_submission(self):
        content_length = int(self.headers.get('Content-Length', '0'))
        raw_body = self.rfile.read(content_length)

        try:
            payload = json.loads(raw_body.decode('utf-8') or '{}')
        except json.JSONDecodeError:
            self._send_json({'error': 'Invalid JSON payload.'}, status=400)
            return

        name = str(payload.get('name', '')).strip()
        email = str(payload.get('email', '')).strip()
        message = str(payload.get('message', '')).strip()

        if not name or not email or not message:
            self._send_json({'error': 'Name, email, and message are required.'}, status=400)
            return

        with sqlite3.connect(DB_PATH) as conn:
            conn.execute(
                'INSERT INTO portfolio_messages (name, email, message) VALUES (?, ?, ?)',
                (name, email, message)
            )
            conn.commit()

        self._send_json({
            'success': True,
            'message': 'Thanks! Your message has been saved and I will get back to you soon.'
        })

    def _resolve_path(self, raw_path):
        path = raw_path.split('?', 1)[0]
        if path in ('', '/'):
            return ROOT / 'index.html'

        safe_path = path.lstrip('/')
        if safe_path.startswith('api/'):
            return None

        requested = (ROOT / safe_path).resolve()
        if ROOT not in requested.parents and requested != ROOT:
            return None

        if requested.exists() and requested.is_file():
            return requested

        if requested.is_dir():
            index_file = requested / 'index.html'
            if index_file.exists():
                return index_file

        return None

    def _serve_file(self, file_path):
        mime_type, _ = mimetypes.guess_type(str(file_path))
        if mime_type is None:
            mime_type = 'application/octet-stream'

        try:
            content = file_path.read_bytes()
        except OSError:
            self._send_error(404, 'File not found')
            return

        self.send_response(200)
        self.send_header('Content-Type', mime_type)
        self.send_header('Content-Length', str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def _send_json(self, payload, status=200):
        body = json.dumps(payload).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(body)

    def _send_error(self, status, message):
        self.send_response(status)
        self.send_header('Content-Type', 'text/plain; charset=utf-8')
        self.end_headers()
        self.wfile.write(message.encode('utf-8'))


if __name__ == '__main__':
    init_db()
    server = ThreadingHTTPServer(('0.0.0.0', PORT), PortfolioHandler)
    print(f'Portfolio AI server running at http://localhost:{PORT}')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nShutting down server...')
        server.server_close()
        sys.exit(0)
