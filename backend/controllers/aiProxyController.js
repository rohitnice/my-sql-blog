const fetch = require('cross-fetch');

const AI_BACKEND_URL = (process.env.AI_BACKEND_URL || 'http://localhost:8000/api/ai').replace(/\/$/, '');

const buildProxyResponse = async (path, req, res) => {
  try {
    const response = await fetch(`${AI_BACKEND_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body || {})
    });

    const rawText = await response.text();
    let body = {};

    if (rawText) {
      try {
        body = JSON.parse(rawText);
      } catch (error) {
        body = { raw: rawText };
      }
    }

    if (!response.ok) {
      return res.status(response.status).json(body);
    }

    return res.json(body);
  } catch (err) {
    console.error('AI backend proxy error:', err);
    return res.status(502).json({ error: 'Unable to reach AI backend', details: err.message });
  }
};

exports.generateExcerpt = async (req, res) => buildProxyResponse('/excerpt', req, res);
exports.generateTitleIdeas = async (req, res) => buildProxyResponse('/title-ideas', req, res);
exports.grammarCheck = async (req, res) => buildProxyResponse('/grammar-check', req, res);
exports.chat = async (req, res) => buildProxyResponse('/chat', req, res);
