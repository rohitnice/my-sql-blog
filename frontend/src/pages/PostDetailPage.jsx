import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { postApi } from '../api/postApi';
import LikeButton from '../components/LikeButton';
import Comments from '../components/Comments';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postApi.getById(id);
        setPost(data);
      } catch (err) {
        setError(true);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(`${API_URL}/api/posts/${id}/comments`);
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  if (error) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>⚠️ Article Not Found in MySQL</h2>;
  if (!post) return <h3 style={{ textAlign: 'center', marginTop: '50px' }}>Fetching content details...</h3>;

  return (
    <div style={{ marginTop: '30px' }}>
      <Link to="/" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 'bold' }}>← Back to Listings</Link>
      <h1 style={{ fontSize: '2.5rem', marginTop: '20px', marginBottom: '10px' }}>{post.title}</h1>
      <p style={{ color: '#666' }}>Published by <strong>{post.author}</strong> on {post.date}</p>
      <div style={{ marginBottom: '20px' }}>
        <LikeButton postId={id} />
      </div>
      <hr style={{ borderColor: '#eee', margin: '20px 0' }} />
      <article style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333', whiteSpace: 'pre-wrap' }}>
        {post.content}
      </article>
      <Comments postId={id} comments={comments} />
    </div>
  );
}