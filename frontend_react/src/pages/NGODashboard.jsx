import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import Toast from '../components/Toast';

let socket;

export default function NGODashboard() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ pending: 0, completed: 0, in_progress: 0, ngos: 0, donations: 0 });
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '' });
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem('helphub_user') || '{}');
  const ngoUserId = currentUser?.id;

  const refreshRequests = async () => {
    setLoading(true);
    try {
      const resp = await axios.get('/api/requests', { headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` } });
      setRequests(resp.data);
      const list = resp.data;
      setStats(prev => ({
        ...prev,
        pending: list.filter(r => r.status === 'Pending').length,
        completed: list.filter(r => r.status === 'Completed').length,
      }));
    } catch (err) {
      console.error('NGO Load error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRequests();
    axios.get('/api/analytics', { headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` } })
      .then(res => setStats(p => ({ ...p, ngos: res.data.ngos || 0, donations: res.data.donations || 0 })));

    socket = io(import.meta.env.VITE_API_URL || '');
    socket.on('new_help_request', (data) => {
      if (data.createdBy !== currentUser.id) {
        setToast({ show: true, message: `New ${data.help_type} request posted!` });
        refreshRequests();
      }
    });

    socket.on('new_donation', (data) => {
      if (data.name !== currentUser.name) {
        setToast({ show: true, message: `New ${data.donationType} donation posted!` });
        refreshRequests();
      }
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const handleAction = async (id, action) => {
    try {
      await axios.put(`/api/requests/${id}/accept`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` } });
      refreshRequests();
    } catch (err) {
      alert('Action failed');
    }
  };

   const displayedRequests = requests.filter(r => {
    if (activeTab === 'mine') return r.targetNgoId?.toString() === ngoUserId;
    if (activeTab === 'open') return r.status === 'Pending';
    if (activeTab === 'community') return r.targetNgoId === null && r.status === 'Pending';
    return true;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <Toast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
      {/* Sidebar */}
      <aside className="glass-dark" style={{ 
        width: '280px', 
        background: '#0f172a', 
        color: 'white', 
        padding: '2rem', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 100
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>🚑</span> NGO HUB
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          <SidebarLink active={activeTab === 'all'} onClick={() => setActiveTab('all')} icon="fa-th-large" label="All Requests" />
          <SidebarLink active={activeTab === 'mine'} onClick={() => setActiveTab('mine')} icon="fa-user-shield" label="Assigned to Me" />
          <SidebarLink active={activeTab === 'community'} onClick={() => setActiveTab('community')} icon="fa-globe" label="Global Community" />
          <SidebarLink active={activeTab === 'open'} onClick={() => setActiveTab('open')} icon="fa-clock" label="Open Cases" />
          <SidebarLink onClick={() => navigate('/analytics')} icon="fa-chart-pie" label="Analytics" />
          <SidebarLink onClick={() => navigate('/chat')} icon="fa-comments" label="NGO Chat" />
        </nav>

        <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          <i className="fas fa-sign-out-alt me-2"></i> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '280px', padding: '3rem' }}>
        <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e293b' }}>Command <span className="text-gradient">Center</span></h1>
            <p style={{ color: '#64748b' }}>Welcome back, {currentUser.name || 'NGO Member'}.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/request" className="btn-primary" style={{ textDecoration: 'none' }}>Post Help</Link>
            <button onClick={refreshRequests} className="btn-secondary" style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700 }}>Refresh</button>
          </div>
        </header>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '3rem' }}>
          <StatBox label="Pending Calls" value={stats.pending} icon="fa-clock" color="#f59e0b" />
          <StatBox label="Completed" value={stats.completed} icon="fa-check-circle" color="#10b981" />
          <StatBox label="Total Donations" value={stats.donations} icon="fa-hand-holding-heart" color="#ef4444" />
          <StatBox label="Global Partners" value={stats.ngos} icon="fa-globe" color="#6366f1" />
        </div>

        {/* Feed */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
          <AnimatePresence>
            {displayedRequests.map((r, idx) => (
              <motion.div 
                key={r._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className="glass"
                style={{ padding: '24px', borderRadius: '24px', background: 'white', border: '1px solid rgba(0,0,0,0.05)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, background: r.priority === 'High' ? '#fef2f2' : '#f0fdf4', color: r.priority === 'High' ? '#ef4444' : '#10b981' }}>
                    {r.priority?.toUpperCase()} PRIORITY
                  </span>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>{r.help_type}</h3>
                <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '20px' }}>{r.description}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px', fontSize: '0.85rem', color: '#64748b' }}>
                  <div><i className="fas fa-map-marker-alt me-2"></i> {r.location}</div>
                  <div><i className="fas fa-phone me-2"></i> {r.contact}</div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  {r.status === 'Pending' ? (
                    <button 
                      onClick={() => handleAction(r._id)}
                      className="btn-primary" 
                      style={{ flex: 1, padding: '12px' }}
                    >
                      {r.targetNgoId ? 'Resolve Case' : 'Accept Request'}
                    </button>
                  ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ textAlign: 'center', padding: '12px', borderRadius: '12px', background: '#f0fdf4', color: '#10b981', fontWeight: 700 }}>
                        <i className="fas fa-check-circle me-2"></i> Operation Accepted
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                        <a href={`tel:${r.contact}`} className="btn-secondary" style={{ textAlign: 'center', padding: '8px', borderRadius: '12px', background: 'white', border: '1px solid #e2e8f0', color: '#64748b', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <i className="fas fa-phone-alt"></i> Call
                        </a>
                        <a href={`mailto:${r.createdBy?.email}?subject=Regarding HelpHub Request`} className="btn-secondary" style={{ textAlign: 'center', padding: '8px', borderRadius: '12px', background: 'white', border: '1px solid #e2e8f0', color: '#64748b', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <i className="fas fa-envelope"></i> Email
                        </a>
                        <Link to={`/chat/${r._id}`} className="btn-primary" style={{ textAlign: 'center', padding: '8px', borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <i className="fas fa-comments"></i> Chat
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ active, onClick, icon, label }) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        padding: '12px 16px', 
        borderRadius: '12px', 
        background: active ? 'var(--primary)' : 'transparent',
        color: active ? 'white' : '#94a3b8',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontWeight: 600,
        transition: 'all 0.2s'
      }}
    >
      <i className={`fas ${icon}`}></i>
      {label}
    </div>
  );
}

function StatBox({ label, value, icon, color }) {
  return (
    <div className="glass" style={{ padding: '24px', borderRadius: '24px', background: 'white', textAlign: 'center' }}>
      <div style={{ color: color, fontSize: '1.5rem', marginBottom: '8px' }}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b' }}>{value}</div>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}
