const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const CHATBOT_URL = import.meta.env.VITE_FASTAPI_URL || import.meta.env.VITE_CHATBOT_URL || 'http://127.0.0.1:8000';
const BASE_URL = `${API_URL}/api/posts`;

export const postApi = {
  // Fetch all posts from MySQL
  getAll: async () => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },

  // Fetch single post by ID
  getById: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error('Failed to fetch post details');
    return res.json();
  },

  // Create a new post
  create: async (postData) => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    if (!res.ok) throw new Error('Failed to save post');
    return res.json();
  },

  // Delete a post
  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete post');
    return res.json();
  },

  // New AI Assistant Chat & Recommendation Call
  askAi: async ({ postId, title, desc, mode, question }) => {
    const res = await fetch(`${CHATBOT_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        post_id: String(postId),
        title,
        desc,
        mode,
        question: question || null
      })
    });
    if (!res.ok) throw new Error('Failed to communicate with AI Assistant');
    return res.json();
  }
};