import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [editName, setEditName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const token = localStorage.getItem('helphub_token');

  useEffect(() => {
    const userObj = JSON.parse(localStorage.getItem('helphub_user') || '{}');
    setUser(userObj);
    setEditName(userObj.name || '');
    setAvatarPreview(userObj.avatar || '');
    
    axios.get('/api/requests', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setRequests(res.data.filter(r => (r.createdBy?._id || r.createdBy) === userObj.id));
      });
      
    axios.get('/api/donations', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setDonations(res.data.filter(d => d.name === userObj.name));
      });
  }, [token]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put('/api/profile', { name: editName, avatar: avatarPreview }, { headers: { Authorization: `Bearer ${token}` } });
      setUser(res.data);
      localStorage.setItem('helphub_user', JSON.stringify(res.data));
      setEditMode(false);
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fas fa-spinner fa-spin fa-2x text-primary"></i></div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '4rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>My <span className="text-gradient">Profile</span></h1>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Manage your account and track your impact.</p>
          </div>
          <Link to="/dashboard" style={{ textDecoration: 'none', fontWeight: 700, color: 'var(--primary)' }}>← Back to Dashboard</Link>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          {/* Identity Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass" 
            style={{ padding: '3rem', borderRadius: '40px', background: 'white', textAlign: 'center', alignSelf: 'start' }}
          >
            <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto 2rem' }}>
              <img 
                src={avatarPreview || user.avatar || 'https://via.placeholder.com/150'} 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '5px solid #f1f5f9' }} 
                alt="Avatar"
              />
              <AnimatePresence>
                {editMode && (
                  <motion.button 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    onClick={() => fileInputRef.current.click()}
                    style={{ position: 'absolute', bottom: '5px', right: '5px', width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}
                  >
                    <i className="fas fa-camera"></i>
                  </motion.button>
                )}
              </AnimatePresence>
              <input type="file" ref={fileInputRef} hidden onChange={handleAvatarChange} />
            </div>

            {editMode ? (
              <input 
                className="form-control-v2" 
                style={{ textAlign: 'center', marginBottom: '1rem' }} 
                value={editName} 
                onChange={e => setEditName(e.target.value)} 
              />
            ) : (
              <h2 style={{ fontWeight: 900, marginBottom: '0.5rem' }}>{user.name}</h2>
            )}
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{user.email}</p>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '2.5rem' }}>
              <span style={{ padding: '6px 16px', borderRadius: '99px', background: '#f1f5f9', fontWeight: 800, fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>
                {user.role}
              </span>
            </div>

            {editMode ? (
              <div style={{ display: 'grid', gap: '10px' }}>
                <button onClick={handleSave} className="btn-primary" style={{ padding: '14px' }}>{saving ? 'Saving...' : 'Save Profile'}</button>
                <button onClick={() => setEditMode(false)} style={{ border: 'none', background: 'transparent', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setEditMode(true)} className="btn-secondary" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, cursor: 'pointer' }}>
                Edit Account
              </button>
            )}
          </motion.div>

          {/* Impact Column */}
          <div style={{ display: 'grid', gap: '30px' }}>
            {/* Impact Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <ImpactCard count={requests.length} label="Calls for Help" icon="fa-bullhorn" color="#6366f1" />
              <ImpactCard count={donations.length} label="Contributions" icon="fa-heart" color="#ef4444" />
              <ImpactCard count={requests.filter(r => r.status === 'Completed').length} label="Cases Resolved" icon="fa-check-circle" color="#10b981" />
            </div>

            {/* Activity Feed */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass" 
              style={{ padding: '2.5rem', borderRadius: '40px', background: 'white' }}
            >
              <h3 style={{ fontWeight: 900, marginBottom: '2rem' }}>Recent Activity</h3>
              
              <div style={{ display: 'grid', gap: '16px' }}>
                {requests.length === 0 && donations.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    <i className="fas fa-history fa-3x mb-3" style={{ opacity: 0.3 }}></i>
                    <p>No activity recorded yet. Start by helping others!</p>
                  </div>
                ) : (
                  <>
                    {requests.map(r => (
                      <ActivityRow 
                        key={r._id} 
                        title={r.help_type} 
                        date={r.createdAt} 
                        status={r.status} 
                        type="request" 
                        onChat={r.status !== 'Pending' ? () => navigate(`/chat/${r._id}`) : undefined}
                      />
                    ))}
                    {donations.map(d => (
                      <ActivityRow 
                        key={d._id} 
                        title={`Donated ${d.item || d.amount}`} 
                        date={d.createdAt} 
                        status={d.status || 'Success'} 
                        type="donation" 
                        onChat={() => navigate(`/chat/${d._id}?type=donation`)}
                      />
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        .form-control-v2 { width: 100%; padding: 12px 16px; border-radius: 12px; border: 2px solid #f1f5f9; font-family: inherit; font-weight: 700; }
        .form-control-v2:focus { outline: none; border-color: var(--primary); }
      `}</style>
    </div>
  );
}

function ImpactCard({ count, label, icon, color }) {
  return (
    <div className="glass" style={{ padding: '24px', borderRadius: '32px', background: 'white', textAlign: 'center' }}>
      <div style={{ color: color, fontSize: '1.25rem', marginBottom: '8px' }}><i className={`fas ${icon}`}></i></div>
      <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>{count}</div>
      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

function ActivityRow({ title, date, status, type, onChat }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: type === 'request' ? '#6366f115' : '#ef444415', color: type === 'request' ? '#6366f1' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className={`fas ${type === 'request' ? 'fa-bullhorn' : 'fa-heart'}`}></i>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{title}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(date).toLocaleDateString()}</div>
      </div>
      {onChat && (
        <button 
          onClick={onChat}
          style={{ padding: '8px 16px', borderRadius: '8px', border: `1px solid var(--primary)`, background: 'transparent', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
        >
          <i className="fas fa-comment"></i> Chat
        </button>
      )}
      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: status === 'Completed' || status === 'Success' ? '#10b981' : '#f59e0b', background: status === 'Completed' || status === 'Success' ? '#f0fdf4' : '#fefce8', padding: '4px 12px', borderRadius: '99px' }}>
        {status?.toUpperCase()}
      </span>
    </div>
  );
}
