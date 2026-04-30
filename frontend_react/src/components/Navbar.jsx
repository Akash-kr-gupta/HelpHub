import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ token, user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem('helphub_token');
    localStorage.removeItem('helphub_user');
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
            {user.role === 'ngo' && <NavLink to="/ngo-dashboard">NGO Hub</NavLink>}
            {user.role === 'volunteer' && <NavLink to="/volunteer-dashboard">Volunteer Hub</NavLink>}
            {user.role === 'citizen' && <NavLink to="/dashboard">Dashboard</NavLink>}
            <NavLink to="/donate">Donate</NavLink>
            <NavLink to="/profile">Profile</NavLink>
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
