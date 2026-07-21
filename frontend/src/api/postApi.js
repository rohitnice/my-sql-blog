const BASE_URL = 'http://localhost:5000/api/posts';

export const postApi = {
  getAll: async () => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error('Failed to fetch post details');
    return res.json();
  },

  create: async (postData) => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    if (!res.ok) throw new Error('Failed to save post');
    return res.json();
  },

  generateExcerpt: async (content) => {
    const res = await fetch(`${BASE_URL}/ai/excerpt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    if (!res.ok) throw new Error('Failed to generate excerpt');
    return res.json();
  },

  generateTitleIdeas: async (content, currentTitle) => {
    const res = await fetch(`${BASE_URL}/ai/title-ideas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, currentTitle })
    });
    if (!res.ok) throw new Error('Failed to generate title ideas');
    return res.json();
  },

  grammarCheck: async (text) => {
    const res = await fetch(`${BASE_URL}/ai/grammar-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error('Failed to grammar check');
    return res.json();
  },

  chat: async (messages) => {
    const res = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages })
    });
    if (!res.ok) throw new Error('Failed to send chat message');
    return res.json();
  }
};