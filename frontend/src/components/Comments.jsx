import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Comments({ postId, comments: initialComments }) {
  const { user, token } = useAuth();
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to comment');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to add comment');
        return;
      }

      setComments([{ ...data, id: data.id }, ...comments]);
      setNewComment('');
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setComments(comments.filter(c => c.id !== commentId));
      } else {
        setError('Failed to delete comment');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <h3>Comments ({comments.length})</h3>

      {user ? (
        <form onSubmit={handleAddComment} style={{ marginBottom: '30px' }}>
          {error && <div style={{ color: 'red', marginBottom: '10px', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>{error}</div>}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              height: '80px',
              fontFamily: 'sans-serif',
              resize: 'vertical'
            }}
          />
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            style={{
              marginTop: '10px',
              background: '#0070f3',
              color: '#fff',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Adding...' : 'Add Comment'}
          </button>
        </form>
      ) : (
        <p style={{ background: '#f0f0f0', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
          <a href="/login" style={{ color: '#0070f3', textDecoration: 'none' }}>Login</a> to comment on this post
        </p>
      )}

      <div>
        {comments.length === 0 ? (
          <p style={{ color: '#666' }}>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <div
              key={comment.id}
              style={{
                border: '1px solid #eee',
                borderRadius: '4px',
                padding: '15px',
                marginBottom: '15px',
                background: '#f9f9f9'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ color: '#0070f3' }}>{comment.username}</strong>
                <small style={{ color: '#999' }}>{new Date(comment.created_at).toLocaleDateString()}</small>
              </div>
              {user && user.username === comment.username && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  style={{
                    background: '#ff6b6b',
                    color: '#fff',
                    padding: '4px 8px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    marginBottom: '8px'
                  }}
                >
                  Delete
                </button>
              )}
              <p style={{ color: '#333', margin: '8px 0' }}>{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}