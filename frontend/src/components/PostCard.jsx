import React from 'react';
import { Link } from 'react-router-dom';
import LikeButton from './LikeButton';

export default function PostCard({ post }) {
  return (
    <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#111' }}>{post.title}</h3>
      <p style={{ color: '#777', fontSize: '0.85rem' }}>By {post.author} on {post.date}</p>
      <p style={{ color: '#444', lineHeight: '1.5' }}>{post.excerpt}</p>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '15px' }}>
        <LikeButton postId={post.id} />
        <Link to={`/post/${post.id}`} style={{ color: '#0070f3', fontWeight: 'bold', textDecoration: 'none' }}>
          Read Full Post →
        </Link>
      </div>
    </div>
  );
}