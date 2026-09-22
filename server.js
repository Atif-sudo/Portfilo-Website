require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

app.use(express.json({ limit: '1mb' }));

app.post('/api/chat', async (req, res) => {
  const message = req.body?.message || '';

  if (!message.trim()) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  if (!OPENAI_API_KEY) {
    return res.status(200).json({
      reply:
        'The live AI assistant is ready, but the server is missing an API key. Add OPENAI_API_KEY in a .env file to enable real AI responses.'
    });
  }

  try {
    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content:
              'You are Alex Carter, a web developer and UI designer. Respond as a helpful portfolio assistant for a professional website. Keep answers concise, confident, and relevant to design, web development, project work, and collaboration.'
          },
          { role: 'user', content: message }
        ]
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      const errText = payload?.error?.message || 'OpenAI request failed.';
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
