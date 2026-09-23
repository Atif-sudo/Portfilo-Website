require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PLACEHOLDER_OPENAI_KEY_VALUES = new Set([
  'your_api_key_here',
  'your_api*****here',
  'your_api_key',
  'your_key_here',
  'replace_me',
  'changeme'
]);
const OPENAI_API_KEY = (process.env.OPENAI_API_KEY || '').trim();
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const requestTimestamps = new Map();
const contactMessages = [];

function hasValidOpenAiKey(value) {
  if (!value) return false;
  const normalized = value.toLowerCase().replace(/[-_\s]/g, '');
  if (PLACEHOLDER_OPENAI_KEY_VALUES.has(normalized)) return false;
  if (value.toLowerCase().startsWith('your_')) return false;
  return true;
}

function sanitizeText(value, maxLength = 2000) {
  return String(value ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
}

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function enforceRateLimit(ip, limitPerMinute = 20) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const history = requestTimestamps.get(ip) || [];
  const recent = history.filter((timestamp) => now - timestamp < windowMs);

  if (recent.length >= limitPerMinute) {
    return false;
  }

  recent.push(now);
  requestTimestamps.set(ip, recent);
  return true;
}

const VALID_OPENAI_API_KEY = hasValidOpenAiKey(OPENAI_API_KEY) ? OPENAI_API_KEY : '';

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' https://fonts.gstatic.com data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://unpkg.com https://cdnjs.cloudflare.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://api.openai.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none';"
  );
  next();
});
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.post('/api/chat', async (req, res) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  if (!enforceRateLimit(clientIp, 20)) {
    return res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
  }

  const message = sanitizeText(req.body?.message || '', 500);

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  if (!VALID_OPENAI_API_KEY) {
    return res.status(200).json({
      reply:
        'The OpenAI API key is missing or still uses the placeholder value. Open https://platform.openai.com/account/api-keys, add your real key to the OPENAI_API_KEY field in .env, and restart the server.'
    });
  }

  try {
    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${VALID_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content:
              'You are Mohammad Atif Ansari, a cybersecurity analyst. Respond as a helpful portfolio assistant for a professional cybersecurity website. Keep answers concise, confident, and relevant to cybersecurity assessment, breach and attack simulation, security control validation, phishing awareness, ASM, and professional opportunities.'
          },
          { role: 'user', content: message }
        ]
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      const errText = payload?.error?.message || 'OpenAI request failed.';
      const lowCreditMessage = 'I am temporarily unavailable because the connected OpenAI account has no remaining credits. Add billing to continue.';

      if (
        /no credits remaining|insufficient_quota|billing|quota/i.test(errText) ||
        response.status === 429
      ) {
        return res.status(200).json({ reply: lowCreditMessage });
      }

      throw new Error(errText);
    }

    const reply = payload?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error('The model returned an empty response.');
    }

    return res.json({ reply });
  } catch (error) {
    console.error('AI request failed:', error.message);
    return res.status(500).json({
      error: 'AI request failed.',
      details: error.message
    });
  }
});

app.post('/api/contact', (req, res) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  if (!enforceRateLimit(clientIp, 10)) {
    return res.status(429).json({ error: 'Too many contact attempts. Please try again later.' });
  }

  const name = sanitizeText(req.body?.name || '', 80);
  const email = sanitizeText(req.body?.email || '', 120);
  const message = sanitizeText(req.body?.message || '', 1200);

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  if (!isEmailValid(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  contactMessages.push({
    name,
    email,
    message,
    createdAt: new Date().toISOString(),
    clientIp
  });

  return res.status(200).json({
    message: 'Your inquiry has been received successfully. I will get back to you soon.'
  });
});

app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found.' });
  }

  return res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Portfolio AI server running at http://localhost:${PORT}`);
});
