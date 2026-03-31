import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ padding: '80px 20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '64px', color: '#6b7280' }}>404</h1>
      <h2 style={{ fontSize: '28px', color: '#111827', marginBottom: '16px' }}>
        Page Not Found
      </h2>
      <p style={{ color: '#6b7280', fontSize: '18px', marginBottom: '32px' }}>
        The page you're looking for doesn't exist.
      </p>
      <Link 
        to="/dashboard"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '16px 32px',
          borderRadius: '12px',
          fontSize: '18px',
          fontWeight: '600',
          textDecoration: 'none',
          display: 'inline-block'
        }}
      >
        Go to Dashboard
      </Link>
    </div>
  );
}