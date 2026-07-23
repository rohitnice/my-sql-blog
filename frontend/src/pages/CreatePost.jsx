import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postApi } from '../api/postApi';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title,
      author,
      excerpt,
      content
    };

    postApi.create(payload)
      .then(() => navigate('/'))
      .catch(err => {
        console.error(err);
        alert("Error saving your article to the backend.");
      });
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h1>Publish to MySQL Database</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <input 
          type="text" 
          required 
          placeholder="Article Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          style={inputStyle} 
        />
        <input 
          type="text" 
          required 
          placeholder="Author Name" 
          value={author} 
          onChange={(e) => setAuthor(e.target.value)} 
          style={inputStyle} 
        />
        <input 
          type="text" 
          required 
          placeholder="Short Excerpt" 
          value={excerpt} 
          onChange={(e) => setExcerpt(e.target.value)} 
          style={inputStyle} 
        />
        <textarea 
          required 
          placeholder="Write full content here..." 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          style={{ ...inputStyle, height: '150px' }} 
        />
        <button 
          type="submit" 
          style={{ 
            background: '#0070f3', 
            color: '#fff', 
            padding: '12px', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            fontWeight: 'bold', 
            fontSize: '1rem' 
          }}
        >
          Publish Post
        </button>
      </form>
    </div>
  );
}

const inputStyle = { 
  width: '100%', 
  padding: '10px', 
  border: '1px solid #ccc', 
  borderRadius: '4px', 
  boxSizing: 'border-box' 
};