import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } }
};

export default function Home() {
  const [recent, setRecent] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/requests/recent', { headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` } })
      .then((res) => setRecent(res.data))
      .catch(() => {});

    axios.get('/api/analytics', { headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` } })
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="home-v2" style={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <section style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'relative',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white',
        padding: '2rem'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', opacity: 0.4 }}>
          <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'var(--primary)', filter: 'blur(120px)', borderRadius: '50%', top: '-200px', right: '-100px', animation: 'float 20s infinite alternate' }}></div>
          <div style={{ position: 'absolute', width: '500px', height: '500px', background: '#a855f7', filter: 'blur(100px)', borderRadius: '50%', bottom: '-100px', left: '-100px', animation: 'float 25s infinite alternate-reverse' }}></div>
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '900px' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
            <span style={{ 
              display: 'inline-block', 
              padding: '8px 24px', 
              borderRadius: '99px', 
              background: 'rgba(255,255,255,0.1)', 
              backdropFilter: 'blur(10px)', 
              border: '1px solid rgba(255,255,255,0.2)',
              fontSize: '0.9rem',
              fontWeight: 700,
              letterSpacing: '1px',
              marginBottom: '2rem',
              textTransform: 'uppercase'
            }}>
              🚀 India's Social Emergency Network
            </span>
            <h1 style={{ fontSize: 'clamp(3rem, 10vw, 5.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Anyone Can <span className="text-gradient">Ask</span>.<br/>
              Anyone Can <span className="text-gradient">Help</span>.
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
              A real-time digital response network connecting those in need with local heroes, donors, and NGOs instantly.
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/request')}
                style={{ padding: '18px 40px', borderRadius: '16px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 20px var(--primary-glow)' }}
              >
                🆘 I Need Urgent Help
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const user = JSON.parse(localStorage.getItem('helphub_user') || 'null');
                  if (!user) navigate('/signup');
                  else if (user.role === 'ngo') navigate('/ngo-dashboard');
                  else if (user.role === 'volunteer') navigate('/volunteer-dashboard');
                  else navigate('/dashboard');
                }}
                style={{ padding: '18px 40px', borderRadius: '16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
              >
                🤝 I Want to Volunteer
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '8rem 0', background: 'white' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>How It <span className="text-gradient">Works</span></h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Simple, transparent, and built for speed.</p>
          </header>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}
          >
            <FeatureCard icon="📢" title="Post Request" desc="Upload the emergency details with a photo and live location." />
            <FeatureCard icon="🌍" title="Network Alert" desc="Nearby volunteers and verified NGOs receive instant notifications." />
            <FeatureCard icon="✅" title="Help Provided" desc="Volunteers arrive, provide support, and mark the task as complete." />
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section style={{ padding: '6rem 0', background: '#f8fafc', borderY: '1px solid #e2e8f0' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '40px' }}>
          <StatBox label="Active Requests" value={stats.total} icon="fa-bullhorn" color="var(--primary)" />
          <StatBox label="Impact Created" value="1200+" icon="fa-heart" color="#ef4444" />
          <StatBox label="Verified NGOs" value="45+" icon="fa-building" color="#10b981" />
        </div>
      </section>

      {/* Recent Emergencies */}
      <section style={{ padding: '8rem 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
            <div>
              <h2 style={{ fontSize: '3rem', fontWeight: 900 }}>Live Feed</h2>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Active cases being handled right now.</p>
            </div>
            <Link to="/dashboard" style={{ fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>View All Dashboard →</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {recent.map((item, idx) => (
              <motion.div 
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                style={{ 
                  borderRadius: '24px', 
                  padding: '24px', 
                  background: 'white', 
                  boxShadow: 'var(--shadow-md)', 
                  border: '1px solid #e2e8f0' 
                }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '16px', overflow: 'hidden' }}>
                    <img src={item.photo ? (item.photo.startsWith('data:') ? item.photo : `/uploads/${item.photo}`) : 'https://via.placeholder.com/150'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Emergency" />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontWeight: 800 }}>{item.help_type}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{item.location}</p>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: item.status === 'Pending' ? 'var(--danger)' : 'var(--success)', background: item.status === 'Pending' ? '#fef2f2' : '#f0fdf4', padding: '4px 12px', borderRadius: '99px' }}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: 'white', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>🚑 HelpHub</div>
        <p style={{ opacity: 0.5 }}>© 2026 HelpHub. Built for immediate social impact ❤️</p>
      </footer>

      {/* SOS FAB */}
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 15 }} 
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/request')}
        style={{ 
          position: 'fixed', 
          bottom: '40px', 
          right: '40px', 
          width: '70px', 
          height: '70px', 
          borderRadius: '50%', 
          background: '#ef4444', 
          color: 'white', 
          border: 'none', 
          fontSize: '1.5rem', 
          boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4)',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        🆘
      </motion.button>

      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, 40px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div variants={itemVariants} whileHover={{ y: -10 }} style={{ 
      padding: '3rem', 
      borderRadius: '32px', 
      background: '#f8fafc', 
      textAlign: 'center',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
    </motion.div>
  );
}

function StatBox({ label, value, icon, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '1.5rem', color: color, marginBottom: '8px' }}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)' }}>{value}</div>
      <div style={{ fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>{label}</div>
    </div>
  );
}
