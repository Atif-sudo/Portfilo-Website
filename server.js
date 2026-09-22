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

function hasValidOpenAiKey(value) {
  if (!value) return false;
  const normalized = value.toLowerCase().replace(/[-_\s]/g, '');
  if (PLACEHOLDER_OPENAI_KEY_VALUES.has(normalized)) return false;
  if (value.toLowerCase().startsWith('your_')) return false;
  return true;
}

const VALID_OPENAI_API_KEY = hasValidOpenAiKey(OPENAI_API_KEY) ? OPENAI_API_KEY : '';

app.use(express.json({ limit: '1mb' }));

app.post('/api/chat', async (req, res) => {
  const message = req.body?.message || '';

  if (!message.trim()) {
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
        return res.status(200).json({
          reply: lowCreditMessage
        });
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
