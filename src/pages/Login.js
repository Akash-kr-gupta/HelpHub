// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError('');

      const result = await login(form.email, form.password);

      if (result.success) {
        navigate(result.user.role === 'admin' ? '/admin/ngos' : '/');
      } else {
        setError(result.message || "Login failed");
      }

    } catch (err) {
      console.error(err);
      setError("Server not reachable. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '48px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
      }}>

        <h1 style={{
          textAlign: 'center',
          fontSize: '32px',
          fontWeight: '800',
          color: '#111827',
          marginBottom: '8px'
        }}>
          Welcome Back
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#6b7280',
          marginBottom: '36px'
        }}>
          Sign in to your HelpHub account
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{
              padding: '16px',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '16px',
              background: '#f9fafb'
            }}
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{
              padding: '16px',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '16px',
              background: '#f9fafb'
            }}
            required
          />

          {/* ERROR */}
          {error && (
            <div style={{
              padding: '12px',
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              color: '#dc2626',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading
                ? '#9ca3af'
                : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              padding: '16px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: '0.3s'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        {/* SIGNUP LINK */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/signup" style={{ color: '#3b82f6', textDecoration: 'none' }}>
            Don't have an account? Sign up
          </Link>
        </div>

      </div>
    </div>
  );
}