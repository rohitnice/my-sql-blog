import os
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

load_dotenv()
app = FastAPI()

class ContentRequest(BaseModel):
    content: str = Field(..., min_length=1)
    currentTitle: Optional[str] = None

class TextRequest(BaseModel):
    text: str = Field(..., min_length=1)

class ChatMessage(BaseModel):
    role: str = Field(..., min_length=1)
    content: str = Field(..., min_length=1)

class ChatRequest(BaseModel):
    messages: List[ChatMessage] = Field(..., min_items=1)


def generate_simple_excerpt(content: str) -> str:
    words = content.strip().split()
    if not words:
        return ''
    excerpt = ' '.join(words[:25])
    if len(words) > 25:
        excerpt += '...'
    return excerpt


def generate_simple_titles(content: str, current_title: Optional[str] = None) -> List[str]:
    normalized = ' '.join(content.strip().split())
    title_root = current_title.strip() if current_title and current_title.strip() else ''
    if not title_root:
        title_root = normalized.split('.')[0][:50].strip()
    title_root = title_root.rstrip(' .')
    if not title_root:
        title_root = 'Blog Post'

    return [
        f'{title_root}: A Practical Guide',
        f'How to {title_root}' if not title_root.lower().startswith('how to') else f'{title_root} Explained',
        f'{title_root} — Tips and Insights'
    ]


def ensure_sentence_case(text: str) -> str:
    cleaned = text.strip()
    if not cleaned:
        return cleaned
    cleaned = cleaned.replace(' i ', ' I ')
    if cleaned and cleaned[0].islower():
        cleaned = cleaned[0].upper() + cleaned[1:]
    return cleaned


def simple_chat_response(messages: List[ChatMessage]) -> str:
    last_user = ''
    for message in reversed(messages):
        if message.role.strip().lower() == 'user':
            last_user = message.content.strip()
            break

    if not last_user:
        return 'Hello! How can I help you today?'

    lower_msg = last_user.lower()
    if 'title' in lower_msg:
        return 'Try using a concise and descriptive title that highlights the topic clearly.'
    if 'grammar' in lower_msg or 'check' in lower_msg:
        return 'I can help you improve your text. Paste the content and I will review it.'
    if 'hello' in lower_msg or 'hi' in lower_msg:
        return 'Hi there! What would you like to do with your blog post today?'

    return f'I heard you: "{last_user}". What else would you like to do?'


@app.get('/health')
def health():
    return {'status': 'ok'}


@app.post('/api/ai/excerpt')
def generate_excerpt(request: ContentRequest):
    excerpt = generate_simple_excerpt(request.content)
    return {'excerpt': excerpt}


@app.post('/api/ai/title-ideas')
def generate_title_ideas(request: ContentRequest):
    titles = generate_simple_titles(request.content, request.currentTitle)
    if not titles:
        raise HTTPException(status_code=500, detail='Unable to generate title ideas')
    return {'titles': titles}


@app.post('/api/ai/grammar-check')
def grammar_check(request: TextRequest):
    corrected_text = ensure_sentence_case(request.text)
    return {'correctedText': corrected_text}


@app.post('/api/ai/chat')
def chat(request: ChatRequest):
    response = simple_chat_response(request.messages)
    return {'response': response}
