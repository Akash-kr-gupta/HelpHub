import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import Toast from '../components/Toast';

let socket;

export default function VolunteerDashboard() {
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [activeTab, setActiveTab] = useState('requests');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '' });
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('helphub_user') || '{}');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqResp, donResp] = await Promise.all([
        axios.get('/api/requests', { headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` } }),
        axios.get('/api/donations', { headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` } })
      ]);
      setRequests(reqResp.data);
      setDonations(donResp.data);
    } catch (err) {
      console.error('Volunteer Load error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    socket = io(import.meta.env.VITE_API_URL || '');
    socket.on('new_help_request', (data) => {
      if (data.createdBy !== currentUser.id) {
        setToast({ show: true, message: `New ${data.help_type} emergency posted!` });
        fetchData();
      }
    });

    socket.on('new_donation', (data) => {
      if (data.name !== currentUser.name) {
        setToast({ show: true, message: `New ${data.donationType} donation ready for pickup!` });
        fetchData();
      }
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const handleRequestAction = async (id) => {
    try {
      await axios.put(`/api/requests/${id}/accept`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` } });
      fetchData();
    } catch (err) {
      alert('Action failed');
    }
  };

  const handleDonationAction = async (id, action) => {
    try {
      await axios.put(`/api/donations/${id}/${action}`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` } });
      fetchData();
    } catch (err) {
      alert('Action failed');
    }
  };

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
          <span>🤝</span> VOLUNTEER HUB
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          <SidebarLink active={activeTab === 'requests'} onClick={() => setActiveTab('requests')} icon="fa-ambulance" label="Direct Requests" />
          <SidebarLink active={activeTab === 'community'} onClick={() => setActiveTab('community')} icon="fa-globe" label="Community Broadcasts" />
          <SidebarLink active={activeTab === 'accepted'} onClick={() => setActiveTab('accepted')} icon="fa-check-circle" label="Accepted Tasks" />
          <SidebarLink active={activeTab === 'donations'} onClick={() => setActiveTab('donations')} icon="fa-hand-holding-heart" label="Donation Pickups" />
          <SidebarLink onClick={() => navigate('/analytics')} icon="fa-chart-pie" label="Analytics" />
          <SidebarLink onClick={() => navigate('/profile')} icon="fa-user-circle" label="My Profile" />
        </nav>

        <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          <i className="fas fa-sign-out-alt me-2"></i> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '280px', padding: '3rem' }}>
        <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e293b' }}>
              Volunteer <span className="text-gradient">Portal</span>
            </h1>
            <p style={{ color: '#64748b' }}>Welcome, {currentUser.name}. You have {requests.filter(r => r.status === 'Pending').length} pending emergencies and {donations.filter(d => d.status === 'Pending').length} pickup tasks.</p>
          </div>
          <button onClick={fetchData} className="btn-secondary" style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700 }}>
            <i className="fas fa-sync-alt me-2"></i> Sync Tasks
          </button>
        </header>

         {activeTab === 'requests' || activeTab === 'community' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
            <AnimatePresence>
              {requests
                .filter(r => r.status === 'Pending')
                .filter(r => activeTab === 'requests' ? r.targetNgoId !== null : r.targetNgoId === null)
                .map((r, idx) => (
                <TaskCard key={r._id} title={r.help_type} description={r.description} meta={{ requester: r.createdBy?.name || 'Anonymous', location: r.location, contact: r.contact, priority: r.priority }} onAction={() => handleRequestAction(r._id)} actionLabel="Accept Request" color={r.priority === 'High' ? '#ef4444' : '#6366f1'} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
            <AnimatePresence>
              {donations.filter(d => d.status !== 'Completed').map((d, idx) => (
                <TaskCard 
                  key={d._id} 
                  title={`${d.donationType} Donation`} 
                  description={d.item || d.message || 'No description provided'} 
                  meta={{ donor: d.name, address: d.address, contact: d.contact, status: d.status }} 
                  onAction={() => handleDonationAction(d._id, d.status === 'Pending' ? 'accept' : 'complete')} 
                  actionLabel={d.status === 'Pending' ? 'Accept Pickup' : 'Mark Picked Up'} 
                  color="#10b981" 
                  secondaryAction={{ label: 'Chat Donor', onClick: () => navigate(`/chat/${d._id}?type=donation`) }}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {loading && <div style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b' }}>Updating tasks...</div>}
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

function TaskCard({ title, description, meta, onAction, actionLabel, color, secondaryAction }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass"
      style={{ padding: '24px', borderRadius: '24px', background: 'white', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, background: `${color}15`, color: color }}>
          {title.toUpperCase()}
        </span>
      </div>
      <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '20px', flex: 1 }}>{description}</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '24px', fontSize: '0.85rem', color: '#64748b' }}>
        {Object.entries(meta).map(([key, val]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ textTransform: 'capitalize', fontWeight: 700, width: '70px' }}>{key}:</span>
            <span style={{ color: '#1e293b' }}>{val}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          onClick={onAction}
          style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: color, color: 'white', fontWeight: 700, cursor: 'pointer' }}
        >
          {actionLabel}
        </button>
        {secondaryAction && (
          <button 
            onClick={secondaryAction.onClick}
            style={{ flex: 1, padding: '12px', borderRadius: '12px', border: `2px solid ${color}`, background: 'transparent', color: color, fontWeight: 700, cursor: 'pointer' }}
          >
            <i className={`fas ${secondaryAction.icon || 'fa-comment'} me-2`}></i> {secondaryAction.label}
          </button>
        )}
      </div>
    </motion.div>
  );
}
