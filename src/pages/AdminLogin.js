// src/pages/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/ngos');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error - check Flask backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px'
    }}>
      <div style={{
        background: 'white', borderRadius: '24px', padding: '48px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        width: '100%', maxWidth: '420px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#111827', margin: 0 }}>
            🔐 Admin Panel
          </h1>
          <p style={{ color: '#6b7280', margin: '8px 0 0 0', fontSize: '16px' }}>
            Manage NGOs & Donations
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@helphub.in"
              style={{
                width: '100%', padding: '16px 20px', border: '2px solid #e5e7eb',
                borderRadius: '12px', fontSize: '16px', background: '#f9fafb',
                transition: 'border-color 0.2s'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              style={{
                width: '100%', padding: '16px 20px', border: '2px solid #e5e7eb',
                borderRadius: '12px', fontSize: '16px', background: '#f9fafb'
              }}
              required
            />
          </div>

          {error && (
            <div style={{
              padding: '14px', background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: '12px', color: '#dc2626', fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white', padding: '18px', border: 'none', borderRadius: '12px',
              fontSize: '18px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? '🔐 Logging in...' : '🔐 Login as Admin'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '28px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
            Demo: <strong>admin@helphub.in</strong> / <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}