import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('helphub_token');

  const logout = () => {
    localStorage.removeItem('helphub_token');
    localStorage.removeItem('helphub_user');
    navigate('/login');
  };

  return (
    <motion.nav
      className="top-nav"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div
        className="brand"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        🚑 HelpHub
      </motion.div>
      <div className="links">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/">Home</Link>
        </motion.div>
        {token && (
          <>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/request">Request Help</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/dashboard">Dashboard</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/donate">Donate</Link>
            </motion.div>
            <motion.button
              className="btn-logout"
              onClick={logout}
              whileHover={{ scale: 1.05, backgroundColor: '#ff4757' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Logout
            </motion.button>
          </>
        )}
        {!token && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/login">Login</Link>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
