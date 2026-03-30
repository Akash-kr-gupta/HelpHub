import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('helphub_token', resp.data.token);
      localStorage.setItem('helphub_user', JSON.stringify(resp.data.user));
      navigate(resp.data.user.role === 'ngo' ? '/ngo-dashboard' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="page form-page">
      <div className="card-box">
        <h2>Login to HelpHub</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="btn primary">Sign in</button>
        </form>
        <p>Don't have account? <Link to="/signup">Signup</Link></p>
      </div>
    </div>
  );
}
