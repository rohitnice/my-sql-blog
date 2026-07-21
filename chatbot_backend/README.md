# Chatbot FastAPI Backend

This service provides AI endpoints for the existing Node backend to proxy requests to.
It uses FastAPI and LangChain with Groq as the LLM provider.

## Setup

1. Create a Python environment and install dependencies:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and set your Groq API key.

3. Start the service:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Default endpoints

- `POST /api/ai/excerpt`
- `POST /api/ai/title-ideas`
- `POST /api/ai/grammar-check`
- `POST /api/ai/chat`

The existing Node backend forwards AI-related requests to this service at `http://localhost:8000/api/ai` by default.
