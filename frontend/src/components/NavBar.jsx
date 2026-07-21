import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: '15px 30px', background: '#111', color: '#fff', display: 'flex', justifyContent: 'space-between', borderRadius: '4px', marginBottom: '20px' }}>
      <h2 style={{ margin: 0 }}>🚀 FullStackBlog</h2>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
        <Link to="/create" style={{ color: '#0070f3', background: '#fff', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>+ Write Post</Link>
        {user ? (
          <>
            <span style={{ color: '#fff' }}>Hi, {user.username}</span>
            <button
              onClick={logout}
              style={{
                background: '#ff6b6b',
                color: '#fff',
                padding: '6px 12px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
            <Link to="/register" style={{ color: '#fff', background: '#0070f3', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}