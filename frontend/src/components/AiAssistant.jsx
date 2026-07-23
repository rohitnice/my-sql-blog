import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FASTAPI_URL = import.meta.env.VITE_FASTAPI_URL || 'http://127.0.0.1:8000';

export default function AiAssistant({ post, onClose }) {
  const [mode, setMode] = useState('summary');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [suggestedBlog, setSuggestedBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAction = async (selectedMode, customQuestion = null) => {
    setLoading(true);
    setMode(selectedMode);
    try {
      const res = await axios.post(`${FASTAPI_URL}/chat`, {
        post_id: String(post.id),
        title: post.title,
        desc: post.content || post.excerpt || '',
        mode: selectedMode,
        question: customQuestion || (selectedMode === 'qa' ? question : null)
      });

      setAnswer(res.data.answer);
      setSuggestedBlog(res.data.suggested_blog);
    } catch (err) {
      console.error(err);
      setAnswer("Failed to generate response. Ensure the chatbot backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>✨ AI Assistant</h3>
          <button onClick={onClose} style={closeButtonStyle}>Close AI</button>
        </div>

        {/* Mode Selector Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
          {['summary', 'keypoints', 'apply'].map((m) => (
            <button
              key={m}
              onClick={() => handleAction(m)}
              style={{
                ...tabButtonStyle,
                background: mode === m ? '#0070f3' : '#f0f0f0',
                color: mode === m ? '#fff' : '#333'
              }}
            >
              {m === 'summary' ? 'Summary' : m === 'keypoints' ? 'Key Points' : 'Apply'}
            </button>
          ))}
        </div>

        {/* Response Area */}
        <div style={responseBoxStyle}>
          {loading ? (
            <p style={{ color: '#888', fontStyle: 'italic' }}>Thinking...</p>
          ) : (
            <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              {answer || "Click a button above or ask a question below to analyze this blog post!"}
            </p>
          )}
        </div>

        {/* Vector Search Suggested Blog */}
        {suggestedBlog && (
          <div style={recommendationStyle}>
            <span>💡 <strong>Recommended Next Read:</strong> </span>
            <button
              onClick={() => {
                onClose();
                navigate(`/posts/${suggestedBlog.id}`);
              }}
              style={linkButtonStyle}
            >
              {suggestedBlog.title}
            </button>
          </div>
        )}

        {/* Q&A Input Box */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
          <input
            type="text"
            placeholder="Ask about this blog..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={inputStyle}
            onKeyDown={(e) => e.key === 'Enter' && handleAction('qa', question)}
          />
          <button 
            onClick={() => handleAction('qa', question)} 
            disabled={loading || !question.trim()}
            style={sendButtonStyle}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// Inline Styles
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalStyle = {
  background: '#121824',
  color: '#fff',
  padding: '20px',
  borderRadius: '12px',
  width: '90%',
  maxWidth: '450px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
};

const closeButtonStyle = {
  background: '#333',
  color: '#fff',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer'
};

const tabButtonStyle = {
  flex: 1,
  padding: '8px 12px',
  border: 'none',
  borderRadius: '6px',
  fontWeight: '600',
  cursor: 'pointer'
};

const responseBoxStyle = {
  background: '#1e293b',
  padding: '15px',
  borderRadius: '8px',
  minHeight: '100px',
  maxHeight: '220px',
  overflowY: 'auto'
};

const recommendationStyle = {
  marginTop: '12px',
  padding: '10px',
  background: '#0f172a',
  borderRadius: '6px',
  fontSize: '0.9rem'
};

const linkButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#38bdf8',
  textDecoration: 'underline',
  cursor: 'pointer',
  fontWeight: 'bold',
  padding: 0
};

const inputStyle = {
  flex: 1,
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #334155',
  background: '#0f172a',
  color: '#fff'
};

const sendButtonStyle = {
  background: '#06b6d4',
  color: '#fff',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer'
};