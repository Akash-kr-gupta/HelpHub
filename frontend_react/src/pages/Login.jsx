import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
   const navigate = useNavigate();
 
  useEffect(() => {
    if (localStorage.getItem('helphub_token')) {
      const user = JSON.parse(localStorage.getItem('helphub_user') || '{}');
      if (user.role === 'ngo') navigate('/ngo-dashboard');
      else if (user.role === 'volunteer') navigate('/volunteer-dashboard');
      else navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const resp = await axios.post('/api/auth/login', { email, password });

      localStorage.setItem('helphub_token', resp.data.token);
      localStorage.setItem('helphub_user', JSON.stringify(resp.data.user));
      
      // Redirect to correct dashboard after login
      if (resp.data.user.role === 'ngo') {
        navigate('/ngo-dashboard');
      } else if (resp.data.user.role === 'volunteer') {
        navigate('/volunteer-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
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
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '2rem'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{ 
          maxWidth: '450px', 
          width: '100%', 
          padding: '3rem', 
          borderRadius: '32px', 
          background: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🚑</div>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Log in to your HelpHub account</p>

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: '#fef2f2', color: 'var(--danger)', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 600 }}>
            <i className="fas fa-exclamation-circle me-2"></i> {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ textAlign: 'left' }}>
            <label className="form-label-v2">Email Address</label>
            <input 
              type="email" 
              className="form-control-v2" 
              placeholder="name@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <label className="form-label-v2">Password</label>
            <input 
              type="password" 
              className="form-control-v2" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary" 
            disabled={loading}
            style={{ width: '100%', padding: '16px', marginTop: '10px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </motion.button>
        </form>

        <p style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>
          New to HelpHub? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Create Account</Link>
        </p>
      </motion.div>

      <style>{`
        .form-label-v2 { display: block; font-weight: 700; color: var(--text-main); margin-bottom: 8px; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .form-control-v2 { width: 100%; padding: 14px 18px; border-radius: 12px; border: 2px solid rgba(0,0,0,0.05); background: white; font-family: inherit; transition: all 0.2s; }
        .form-control-v2:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-glow); }
      `}</style>
    </div>
  );
}
