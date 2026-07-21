import React from 'react';
import { useState, useEffect } from 'react';
import { postApi } from '../api/postApi';
import PostCard from '../components/PostCard';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postApi.getAll()
      .then(data => setPosts(data))
      .catch(err => console.error("Error loading posts:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <h3 style={{ textAlign: 'center', marginTop: '50px' }}>Loading articles from database...</h3>;

  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '30px 0' }}>Latest Database Articles</h1>
      {posts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No articles found. Click "+ Write Post" to create one!</p>
      ) : (
        posts.map(post => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}