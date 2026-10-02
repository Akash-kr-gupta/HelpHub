import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { createSocket } from '../utils/socket';
import { clearStoredAuth, getChatRooms, getUnreadMessageCount, incrementUnreadMessages } from '../utils/storage';

export default function Navbar({ token, user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeUser = user || getStoredUser();
  const [unreadCount, setUnreadCount] = useState(() => getUnreadMessageCount());

  useEffect(() => {
    if (!token) {
      setUnreadCount(0);
      return undefined;
    }

    const socket = createSocket();
    getChatRooms().forEach((roomId) => socket.emit('join_room', roomId));
    const activeRoomId = location.pathname.startsWith('/chat/') ? location.pathname.split('/chat/')[1] : '';
    const handleMessage = (message) => {
      if (!message.roomId || message.roomId === activeRoomId) return;
      incrementUnreadMessages(message.roomId);
      setUnreadCount(getUnreadMessageCount());
    };
    const refreshUnreadCount = () => setUnreadCount(getUnreadMessageCount());

    socket.on('receive_message', handleMessage);
    window.addEventListener('helphub-unread-changed', refreshUnreadCount);
    return () => {
      socket.off('receive_message', handleMessage);
      window.removeEventListener('helphub-unread-changed', refreshUnreadCount);
      socket.disconnect();
    };
  }, [token, location.pathname]);

  const logout = () => {
    clearStoredAuth();
    navigate('/');
  };

  // Hide navbar on dashboard layouts
  if (['/dashboard', '/ngo-dashboard', '/volunteer-dashboard'].includes(location.pathname)) {
    return null;
  }

  return (
    <motion.nav
      className="top-nav"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ 
        background: 'rgba(15, 23, 42, 0.9)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Link to="/" style={{ textDecoration: 'none' }}>
        <motion.div
          className="brand"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <span style={{ fontSize: '1.5rem' }}>🚑</span>
          <span style={{ fontWeight: 800, color: 'white' }}>HelpHub</span>
        </motion.div>
      </Link>

      <div className="links">
        <NavLink to="/">Home</NavLink>
        {token ? (
          <>
            <NavLink to="/request">Request Help</NavLink>
            {activeUser?.role === 'ngo' && <NavLink to="/ngo-dashboard">NGO Hub</NavLink>}
            {activeUser?.role === 'volunteer' && <NavLink to="/volunteer-dashboard">Volunteer Hub</NavLink>}
            {activeUser?.role === 'citizen' && <NavLink to="/dashboard">Dashboard</NavLink>}
            <NavLink to="/donate">Donate</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <motion.button
              type="button"
              onClick={() => navigate('/profile')}
              title="Open conversations"
              aria-label={`Open conversations${unreadCount ? `, ${unreadCount} unread` : ''}`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              style={{ position: 'relative', width: '42px', height: '38px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer' }}
            >
              <i className="fas fa-comment-dots"></i>
              {unreadCount > 0 && <span style={{ position: 'absolute', top: '-7px', right: '-7px', minWidth: '20px', height: '20px', padding: '0 5px', borderRadius: '99px', background: '#ef4444', color: 'white', fontSize: '0.7rem', fontWeight: 800, display: 'grid', placeItems: 'center', border: '2px solid #0f172a' }}>{unreadCount > 99 ? '99+' : unreadCount}</span>}
            </motion.button>
            <motion.button
              className="btn-logout"
              onClick={logout}
              whileHover={{ scale: 1.05, backgroundColor: '#ef4444' }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                border: '1px solid rgba(255,255,255,0.2)', 
                padding: '8px 20px', 
                borderRadius: '12px', 
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Logout
            </motion.button>
          </>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </div>
    </motion.nav>
  );
}

function NavLink({ to, children }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link to={to} style={{ 
        color: 'rgba(255,255,255,0.8)', 
        textDecoration: 'none', 
        fontWeight: 600, 
        padding: '8px 16px',
        borderRadius: '8px',
        transition: 'color 0.2s'
      }}>
        {children}
      </Link>
    </motion.div>
  );
}
