import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'citizen' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/signup', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="page form-page">
      <div className="card-box">
        <h2>Create Account</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" required value={form.name} onChange={( e)=> setForm({ ...form, name: e.target.value })} />
          <input type="email" placeholder="Email" required value={form.email} onChange={( e)=> setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Password" required value={form.password} onChange={( e)=> setForm({ ...form, password: e.target.value })} />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="citizen">Citizen</option>
            <option value="volunteer">Volunteer</option>
            <option value="ngo">NGO</option>
          </select>
          <button className="btn primary">Signup</button>
        </form>
      </div>
    </div>
  );
}
