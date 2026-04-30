import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Toast from '../components/Toast';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

let socket;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export default function Dashboard() {
  const [toast, setToast] = useState({ show: false, message: '' });
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
  });
  const [donations, setDonations] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [activeTab, setActiveTab] = useState('community'); // 'community' or 'my-posts'

  const currentUser = JSON.parse(
    localStorage.getItem('helphub_user') || '{}'
  );

  const fallbackRequestImage =
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1470&auto=format&fit=crop';

  const getOwnerId = (owner) => {
    if (!owner) return null;
    return typeof owner === 'string'
      ? owner
      : owner._id
      ? owner._id.toString()
      : owner.toString();
  };

  const isMyRequest = (request) => {
    const ownerId = getOwnerId(request.createdBy);
    return ownerId && currentUser?.id && ownerId === currentUser.id;
  };

  const loadData = () => {
    axios
      .get('/api/requests', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('helphub_token')}`,
        },
      })
      .then((res) => setRequests(res.data))
      .catch(() => setRequests([]));

    axios
      .get('/api/donations', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('helphub_token')}`,
        },
      })
      .then((res) => setDonations(res.data))
      .catch(() => setDonations([]));

    axios
      .get('/api/analytics', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('helphub_token')}`,
        },
      })
      .then((res) => {
        const data = res.data;
        setStats({
          total: data.total || 0,
          completed: data.completed || 0,
          pending:
            typeof data.pending !== 'undefined'
              ? data.pending
              : (data.total || 0) - (data.completed || 0),
        });
      });
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);

    socket = io(import.meta.env.VITE_API_URL || '');
    socket.on('new_help_request', (data) => {
      if (!currentUser || currentUser.id !== data.createdBy) {
        setToast({
          show: true,
          message: `New ${data.help_type} request posted nearby!`,
        });
        loadData();
      }
    });

    socket.on('new_donation', (data) => {
      if (!currentUser || currentUser.name !== data.name) {
        setToast({ show: true, message: `New ${data.donationType} donation posted nearby!` });
        loadData();
      }
    });

    return () => {
      clearInterval(interval);
      if (socket) socket.disconnect();
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
  };

  const parseCoordinates = (location) => {
    if (!location) return null;
    const parts = location.split(',').map((x) => parseFloat(x.trim()));
    if (parts.length === 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
      return [parts[0], parts[1]];
    }
    return null;
  };

  const markers = [
    ...requests.map((r) => ({
      id: r._id,
      coords: parseCoordinates(r.location),
      title: r.help_type,
      type: 'request',
      status: r.status,
    })),
    ...donations.map((d) => ({
      id: d._id,
      coords: parseCoordinates(d.address),
      title: d.donationType,
      type: 'donation',
      status: d.status,
    }))
  ].filter((m) => m.coords);

  const mapCenter = markers.length > 0 ? markers[0].coords : [20.5937, 78.9629];

  const acceptHelp = (id) => {
    axios
      .put(`/api/requests/${id}/accept`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` },
      })
      .then(loadData);
  };

  const deleteRequest = (id) => {
    if (!window.confirm('Delete this request?')) return;
    axios
      .delete(`/api/requests/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` },
      })
      .then(() => {
        setRequests((prev) => prev.filter((req) => req._id !== id));
      });
  };

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-theme' : ''}`} style={{ display: 'flex', minHeight: '100vh', background: darkMode ? '#0f172a' : '#f8fafc' }}>
      <Toast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="sidebar-glass"
        style={{ 
          width: '280px', 
          height: '100vh', 
          position: 'fixed', 
          left: 0, 
          top: 0, 
          zIndex: 100,
          background: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(16px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem 1.5rem'
        }}
      >
        <div className="sidebar-header" style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'white' }}>
            <i className="fas fa-hands-helping" style={{ margin: 'auto' }}></i>
          </div>
          <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.5rem', background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>HelpHub</h3>
        </div>

        <nav className="sidebar-nav" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SidebarLink to="/" icon="fa-home" label="Home" />
          <SidebarLink to="/dashboard" icon="fa-th-large" label="All Requests" active />
          <SidebarLink to="/request" icon="fa-plus-circle" label="New Request" />
          <SidebarLink to="/donate" icon="fa-heart" label="Donate" />
          <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', margin: '1rem 0' }} />
          <SidebarLink to="/analytics" icon="fa-chart-bar" label="Analytics" />
          <SidebarLink to="/ngo-dashboard" icon="fa-building" label="NGO Portal" />
          <SidebarLink to="/profile" icon="fa-user-circle" label="My Profile" />
        </nav>

        <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={toggleDarkMode} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', color: darkMode ? 'white' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontWeight: 600 }}>
            <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`} style={{ width: '20px' }}></i>
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }} 
            style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <i className="fas fa-sign-out-alt" style={{ width: '20px' }}></i>
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main style={{ marginLeft: '280px', flex: 1, padding: '2.5rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 800, color: darkMode ? 'white' : 'var(--text-main)' }}>Community Board</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '4px' }}>Real-time emergency requests across your area.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
             <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowMap(!showMap)} 
                className="glass"
                style={{ padding: '12px 24px', borderRadius: '99px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 16px var(--primary-glow)' }}
              >
                <i className={`fas ${showMap ? 'fa-list' : 'fa-map'}`}></i>
                {showMap ? 'Show List' : 'View Map'}
              </motion.button>
          </div>
        </header>

        {/* Stats Grid */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '3rem' }}>
          <StatCard label="Total Impact" value={stats.total} icon="fa-globe" color="#6366f1" delay={0} dark={darkMode} />
          <StatCard label="Critical Needs" value={stats.pending} icon="fa-clock" color="#f59e0b" delay={0.1} dark={darkMode} />
          <StatCard label="Successful Helps" value={stats.completed} icon="fa-check-circle" color="#10b981" delay={0.2} dark={darkMode} />
        </motion.div>

        {/* Dynamic Content */}
        <AnimatePresence mode="wait">
          {showMap ? (
            <motion.div key="map" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ height: '600px', borderRadius: '32px', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
              <MapContainer center={mapCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {markers.map((marker) => (
                  <Marker key={marker.id} position={marker.coords}>
                    <Popup>
                      <div style={{ padding: '8px' }}>
                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, color: marker.type === 'request' ? '#ef4444' : '#10b981', display: 'block', marginBottom: '2px' }}>
                          {marker.type}
                        </span>
                        <strong style={{ display: 'block', marginBottom: '4px' }}>{marker.title}</strong>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Status: {marker.status}</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </motion.div>
          ) : (
            <>
              {/* Tabs */}
              <div style={{ display: 'flex', gap: '24px', marginBottom: '2rem', borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`, paddingBottom: '12px' }}>
                <button 
                  onClick={() => setActiveTab('community')}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: activeTab === 'community' ? 'var(--primary)' : 'var(--text-muted)', 
                    fontWeight: 700, 
                    fontSize: '1.1rem', 
                    cursor: 'pointer',
                    position: 'relative',
                    padding: '0 8px'
                  }}
                >
                  Community Feed
                  {activeTab === 'community' && <motion.div layoutId="tab-underline" style={{ position: 'absolute', bottom: '-13px', left: 0, right: 0, height: '3px', background: 'var(--primary)', borderRadius: '2px' }} />}
                </button>
                <button 
                  onClick={() => setActiveTab('my-posts')}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: activeTab === 'my-posts' ? 'var(--primary)' : 'var(--text-muted)', 
                    fontWeight: 700, 
                    fontSize: '1.1rem', 
                    cursor: 'pointer',
                    position: 'relative',
                    padding: '0 8px'
                  }}
                >
                  My Activity
                  {activeTab === 'my-posts' && <motion.div layoutId="tab-underline" style={{ position: 'absolute', bottom: '-13px', left: 0, right: 0, height: '3px', background: 'var(--primary)', borderRadius: '2px' }} />}
                </button>
              </div>

              <motion.div key="list" variants={containerVariants} initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                {requests
                  .filter(r => activeTab === 'my-posts' ? isMyRequest(r) : !isMyRequest(r))
                  .map((r) => (
                    <RequestCard key={r._id} request={r} mine={isMyRequest(r)} onAccept={acceptHelp} onDelete={deleteRequest} fallbackImage={fallbackRequestImage} dark={darkMode} />
                  ))}
                {requests.filter(r => activeTab === 'my-posts' ? isMyRequest(r) : !isMyRequest(r)).length === 0 && (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
                    <i className="fas fa-inbox" style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.3 }}></i>
                    <h3>{activeTab === 'my-posts' ? "You haven't posted any help requests yet." : "No community requests at the moment."}</h3>
                    <p>{activeTab === 'my-posts' ? "Post a request if you need assistance." : "Check back later or post a new request yourself."}</p>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function SidebarLink({ to, icon, label, active = false }) {
  return (
    <Link to={to} style={{ 
      textDecoration: 'none', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px', 
      padding: '12px 16px', 
      borderRadius: '12px',
      background: active ? 'var(--primary)' : 'transparent',
      color: active ? 'white' : 'inherit',
      fontWeight: 600,
      transition: 'all 0.2s'
    }}>
      <i className={`fas ${icon}`} style={{ width: '20px', opacity: active ? 1 : 0.6 }}></i>
      <span>{label}</span>
    </Link>
  );
}

function StatCard({ label, value, icon, color, delay, dark }) {
  return (
    <motion.div variants={itemVariants} className="glass" style={{ 
      padding: '24px', 
      borderRadius: '24px', 
      background: dark ? 'rgba(255,255,255,0.05)' : 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      border: `1px solid ${color}20`,
    }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.5rem' }}>
        <i className={`fas ${icon}`} style={{ margin: 'auto' }}></i>
      </div>
      <div>
        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: dark ? 'white' : 'var(--text-main)' }}>{value}</div>
      </div>
    </motion.div>
  );
}

function RequestCard({ request, mine, onAccept, onDelete, fallbackImage, dark }) {
  const isPending = request.status === 'Pending';
  
  return (
    <motion.div variants={itemVariants} whileHover={{ y: -8 }} className="glass" style={{ 
      borderRadius: '24px', 
      overflow: 'hidden', 
      background: dark ? 'rgba(255,255,255,0.05)' : 'white',
      border: mine ? '2px solid var(--primary)' : '1px solid rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ position: 'relative', height: '200px' }}>
        <img 
          src={request.photo ? (request.photo.startsWith('http') ? request.photo : `/uploads/${request.photo}`) : fallbackImage} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          alt="Emergency"
        />
        <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '6px 14px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, background: isPending ? 'rgba(245, 158, 11, 0.9)' : 'rgba(16, 185, 129, 0.9)', color: 'white', backdropFilter: 'blur(4px)' }}>
            {isPending ? 'PENDING' : 'RESOLVED'}
          </span>
        </div>
        {mine && (
          <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
            <span style={{ padding: '6px 14px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, background: 'var(--primary)', color: 'white' }}>
              YOUR POST
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h4 style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '1.25rem', color: dark ? 'white' : 'var(--text-main)' }}>{request.help_type || 'General Assistance'}</h4>
        
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 900 }}>
            {request.createdBy?.name?.charAt(0) || 'U'}
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: dark ? '#94a3b8' : '#64748b' }}>
            Requested by {mine ? 'You' : (request.createdBy?.name || 'Anonymous User')}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>
          <i className="fas fa-map-marker-alt" style={{ color: 'var(--primary)', width: '16px' }}></i>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{request.location || 'Location shared'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>
          <i className="fas fa-phone-alt" style={{ color: 'var(--primary)', width: '16px' }}></i>
          <span>{request.contact || 'No contact provided'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px', background: dark ? 'rgba(255,255,255,0.05)' : '#f8fafc', padding: '8px 12px', borderRadius: '8px' }}>
          <i className="fas fa-bullhorn" style={{ color: request.targetNgoId ? 'var(--info)' : 'var(--success)', fontSize: '0.8rem' }}></i>
          <span style={{ fontWeight: 600 }}>
            {request.targetNgoId ? `Directed to: ${request.targetNgoName}` : 'Open to Community'}
          </span>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: '10px', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {isPending && !mine && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onAccept(request._id)} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
                Help Now
              </motion.button>
            )}
            {mine && isPending && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onDelete(request._id)} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontWeight: 700, cursor: 'pointer' }}>
                Delete
              </motion.button>
            )}
            {!isPending && !mine && (
              <div style={{ flex: 1, textAlign: 'center', padding: '10px', color: 'var(--success)', fontWeight: 700 }}>
                <i className="fas fa-check-circle me-2"></i> Resolved by {request.completedBy?.name || 'Helper'}
              </div>
            )}
            {!isPending && mine && (
              <div style={{ flex: 1, textAlign: 'center', padding: '10px', color: 'var(--success)', fontWeight: 700, background: '#f0fdf4', borderRadius: '12px' }}>
                <i className="fas fa-check-circle me-2"></i> Accepted by {request.completedBy?.name || 'Helper'}
              </div>
            )}
          </div>
          
          {!isPending && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '4px' }}>
              <a href={`tel:${mine ? request.completedBy?.contact || '0000' : request.contact}`} className="btn-secondary" style={{ textAlign: 'center', padding: '8px', borderRadius: '12px', background: dark ? 'rgba(255,255,255,0.1)' : '#f8fafc', border: 'none', color: dark ? 'white' : '#64748b', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
                <i className="fas fa-phone-alt mb-1 d-block"></i> Call
              </a>
              <a href={`mailto:${mine ? request.completedBy?.email : request.createdBy?.email}?subject=Regarding HelpHub Request`} className="btn-secondary" style={{ textAlign: 'center', padding: '8px', borderRadius: '12px', background: dark ? 'rgba(255,255,255,0.1)' : '#f8fafc', border: 'none', color: dark ? 'white' : '#64748b', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
                <i className="fas fa-envelope mb-1 d-block"></i> Email
              </a>
              <Link to={`/chat/${request._id}`} className="btn-primary" style={{ textAlign: 'center', padding: '8px', borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', background: 'var(--primary)', color: 'white' }}>
                <i className="fas fa-comments mb-1 d-block"></i> Chat
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
