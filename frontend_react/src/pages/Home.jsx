import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  const [recent, setRecent] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0 });
  const [showMoreFeatures, setShowMoreFeatures] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/requests/recent', { headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` } })
      .then((res) => setRecent(res.data))
      .catch(() => {});

    axios.get('/api/analytics', { headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` } })
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        alert(`Your Location: ${pos.coords.latitude}, ${pos.coords.longitude}`);
      });
    }
  };

  const scrollToFeatures = () => {
    setShowMoreFeatures(true);
    setTimeout(() => {
      document.getElementById('more-features').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="page home-page">
      {/* Hero Section */}
      <motion.div
        className="hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            HelpHub
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            India's Social Emergency Network — Anyone Can Ask • Anyone Can Help
          </motion.p>
          <motion.div
            className="action-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.button
              onClick={() => navigate('/request')}
              className="btn-main"
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
            >
              🆘 I Need Help
            </motion.button>
            <motion.button
              onClick={() => navigate('/dashboard')}
              className="btn-main btn-secondary"
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
            >
              🤝 I Want To Help
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="features container"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-center mb-5 fw-bold">How HelpHub Works</h2>
        <div className="row">
          {[
            { icon: '📢', title: 'Post Request', desc: 'Upload emergency with photo & live location instantly.' },
            { icon: '🌍', title: 'Community Responds', desc: 'Nearby volunteers, donors & NGOs get connected.' },
            { icon: '✅', title: 'Help Completed', desc: 'Track request status and confirm help completion.' }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="col-md-4 mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="feature-card text-center"
                onClick={() => index === 0 ? navigate('/donate') : navigate('/dashboard')}
                whileHover={{ y: -12, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h2>{feature.icon} {feature.title}</h2>
                <p>{feature.desc}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        className="stats"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <div className="row">
            <motion.div
              className="col-md-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h1 id="reqCount">{stats.total}</h1>
              <p>Emergency Requests</p>
            </motion.div>
            <motion.div
              className="col-md-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h1>120+</h1>
              <p>Active Volunteers</p>
            </motion.div>
            <motion.div
              className="col-md-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h1>35+</h1>
              <p>Animal Rescues</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Recent Requests */}
      <motion.div
        className="recent container"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-center mb-5">Recent Emergencies</h2>
        <div className="row" id="recentCards">
          {recent.map((item, index) => (
            <motion.div
              key={item._id}
              className="col-md-4 mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="card shadow p-3"
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {item.photo && (
                  <motion.img
                    src={item.photo.startsWith('data:') ? item.photo : `/uploads/${item.photo}`}
                    className="img-fluid mb-2"
                    alt="Request"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <h5>{item.help_type}</h5>
                <p>{item.location}</p>
                <span className={`badge ${item.status === 'Pending' ? 'bg-danger' : 'bg-success'}`}>{item.status}</span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Explore More Button */}
      <div className="text-center my-5">
        <motion.button
          onClick={scrollToFeatures}
          className="btn btn-dark btn-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore More Features ↓
        </motion.button>
      </div>

      {/* More Features */}
      {showMoreFeatures && (
        <motion.div
          id="more-features"
          className="more-features container"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-center mb-5 fw-bold">HelpHub Powerful Features</h2>
          <div className="row text-center">
            {[
              { icon: '📍', title: 'Live Location', desc: 'Detect user location automatically.', action: handleLocation },
              { icon: '🖼', title: 'Photo Upload', desc: 'Share real-time emergency proof.', action: () => navigate('/donate') },
              { icon: '⚡', title: 'Instant Accept', desc: 'Volunteers respond quickly.', action: () => navigate('/dashboard') },
              { icon: '📊', title: 'Status Tracking', desc: 'Monitor help progress easily.', action: () => navigate('/dashboard') }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="col-md-3 mb-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="feature-card"
                  onClick={feature.action}
                  whileHover={{ y: -12, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <h3>{feature.icon} {feature.title}</h3>
                  <p>{feature.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <div className="footer">
        HelpHub © 2026 | Built for Social Impact ❤️
      </div>

      {/* Floating SOS */}
      <motion.a
        href="/donate"
        className="sos"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        🆘
      </motion.a>
    </div>
  );
}
