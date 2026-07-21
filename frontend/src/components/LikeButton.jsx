import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LikeButton({ postId }) {
  const { user, token } = useAuth();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch likes count
    const fetchCount = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/posts/${postId}/likes/count`);
        const data = await res.json();
        setCount(data.count);
      } catch (err) {
        console.error('Error fetching likes count:', err);
      }
    };

    // Check if user liked
    const checkLike = async () => {
      if (!user) return;
      try {
        const res = await fetch(`http://localhost:5000/api/posts/${postId}/likes/check`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        setLiked(data.liked);
      } catch (err) {
        console.error('Error checking like:', err);
      }
    };

    fetchCount();
    checkLike();
  }, [postId, user, token]);

  const handleLike = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      const method = liked ? 'DELETE' : 'POST';
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/likes`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok) {
        setLiked(!liked);
        setCount(data.count);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      style={{
        background: liked ? '#ff6b6b' : '#f0f0f0',
        color: liked ? '#fff' : '#333',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontWeight: 'bold',
        opacity: loading ? 0.6 : 1
      }}
    >
      {liked ? '❤️' : '🤍'} {count} {count === 1 ? 'like' : 'likes'}
    </button>
  );
}