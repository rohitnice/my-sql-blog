import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postApi } from '../api/postApi';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title,
      author,
      excerpt,
      content
    }; // let the backend fill the timestamp so MySQL receives a proper datetime value

    postApi.create(payload)
      .then(() => navigate('/'))
      .catch(err => {
        console.error(err);
        alert("Error saving your article to the backend.");
      });
  };

  const handleGenerateExcerpt = async () => {
    if (!content.trim()) {
      alert('Write some content first to generate an excerpt.');
      return;
    }
    setIsAiLoading(true);
    try {
      const data = await postApi.generateExcerpt(content);
      setExcerpt(data.excerpt || '');
    } catch (err) {
      console.error(err);
      alert('Failed to generate excerpt. Please try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleGenerateTitleIdeas = async () => {
    if (!content.trim()) {
      alert('Write some content first to get title ideas.');
      return;
    }
    setIsAiLoading(true);
    try {
      const data = await postApi.generateTitleIdeas(content, title);
      const titleChoice = data.titles?.[0];
      if (titleChoice) {
        setTitle(titleChoice);
      } else {
        alert('No title ideas returned.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to generate title ideas. Please try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleGrammarCheck = async () => {
    if (!content.trim()) {
      alert('Write some content first to check grammar.');
      return;
    }
    setIsAiLoading(true);
    try {
      const data = await postApi.grammarCheck(content);
      if (data.correctedText) {
        setContent(data.correctedText);
      } else {
        alert('No corrected text returned.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to check grammar. Please try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h1>Publish to MySQL Database</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <input type="text" required placeholder="Article Title" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
        <input type="text" required placeholder="Author Name" value={author} onChange={(e) => setAuthor(e.target.value)} style={inputStyle} />
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input type="text" required placeholder="Short Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
          <button type="button" onClick={handleGenerateExcerpt} disabled={isAiLoading} style={assistButtonStyle}>
            {isAiLoading ? 'Generating…' : 'AI Assist'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button type="button" onClick={handleGenerateTitleIdeas} disabled={isAiLoading} style={assistButtonStyle}>
            {isAiLoading ? 'Working…' : 'Suggest Title'}
          </button>
          <button type="button" onClick={handleGrammarCheck} disabled={isAiLoading} style={assistButtonStyle}>
            {isAiLoading ? 'Working…' : 'Check Grammar'}
          </button>
        </div>
        <textarea required placeholder="Write full content here..." value={content} onChange={(e) => setContent(e.target.value)} style={{ ...inputStyle, height: '150px' }} />
        <button type="submit" style={{ background: '#0070f3', color: '#fff', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
          Publish Post
        </button>
      </form>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
const assistButtonStyle = {
  background: '#0f766e',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '10px 14px',
  cursor: 'pointer',
  fontWeight: '600'
};