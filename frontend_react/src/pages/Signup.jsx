import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'citizen' });
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
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    setLoading(true);
    setError('');
    try {
      const resp = await axios.post('/api/auth/signup', form);
      localStorage.setItem('helphub_token', resp.data.token);
      localStorage.setItem('helphub_user', JSON.stringify(resp.data.user));
      
      // Redirect to correct dashboard after signup
      if (resp.data.user.role === 'ngo') {
        navigate('/ngo-dashboard');
      } else if (resp.data.user.role === 'volunteer') {
        navigate('/volunteer-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
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
          maxWidth: '500px', 
          width: '100%', 
          padding: '3rem', 
          borderRadius: '32px', 
          background: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🤝</div>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>Join the Network</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Be the change you want to see</p>

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: '#fef2f2', color: 'var(--danger)', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 600 }}>
            <i className="fas fa-exclamation-circle me-2"></i> {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ textAlign: 'left' }}>
            <label className="form-label-v2">Full Name</label>
            <input 
              type="text" 
              className="form-control-v2" 
              placeholder="John Doe" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              required 
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <label className="form-label-v2">Email Address</label>
            <input 
              type="email" 
              className="form-control-v2" 
              placeholder="name@example.com" 
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
              required 
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <label className="form-label-v2">Password</label>
            <input 
              type="password" 
              className="form-control-v2" 
              placeholder="Minimum 8 characters" 
              value={form.password} 
              onChange={(e) => setForm({ ...form, password: e.target.value })} 
              required 
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <label className="form-label-v2">Register As</label>
            <select 
              className="form-control-v2" 
              value={form.role} 
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              style={{ appearance: 'none' }}
            >
              <option value="citizen">Individual Citizen</option>
              <option value="volunteer">Dedicated Volunteer</option>
              <option value="ngo">Registered NGO</option>
            </select>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary" 
            disabled={loading}
            style={{ width: '100%', padding: '16px', marginTop: '10px' }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </motion.button>
        </form>

        <p style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Log In</Link>
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
