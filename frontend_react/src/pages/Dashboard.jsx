import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
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

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [darkMode, setDarkMode] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [map, setMap] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('helphub_user') || '{}');
  const fallbackRequestImage = 'https://via.placeholder.com/420x240.png?text=No+Image+Available';

  const getOwnerId = (owner) => {
    if (!owner) return null;
    return typeof owner === 'string' ? owner : owner._id ? owner._id.toString() : owner.toString();
  };

  const isMyRequest = (request) => {
    const ownerId = getOwnerId(request.createdBy);
    return ownerId && currentUser?.id && ownerId === currentUser.id;
  };

  const loadData = () => {
    axios.get('/api/requests', { headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` } })
      .then((res) => setRequests(res.data))
      .catch(() => setRequests([]));

    axios.get('/api/analytics', { headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` } })
      .then((res) => {
        const data = res.data;
        if (typeof data.pending === 'undefined') {
          setStats({
            total: data.total || 0,
            completed: data.completed || 0,
            pending: data.total ? data.total - data.completed : 0,
          });
        } else {
          setStats({
            total: data.total || 0,
            completed: data.completed || 0,
            pending: data.pending || 0,
          });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  const parseCoordinates = (location) => {
    if (!location) return null;
    const parts = location.split(',').map((x) => parseFloat(x.trim()));
    if (parts.length === 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
      return [parts[0], parts[1]];
    }
    return null;
  };

  const markers = requests
    .map((r) => ({ id: r._id, coords: parseCoordinates(r.location), help_type: r.help_type, status: r.status }))
    .filter((r) => r.coords);

  const mapCenter = markers.length > 0 ? markers[0].coords : [20.5937, 78.9629];

  const acceptHelp = (id) => {
    axios.put(`/api/requests/${id}/accept`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` } })
      .then(() => {
        axios.get('/api/requests', { headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` } })
          .then((res) => setRequests(res.data));
      });
  };

  const deleteRequest = (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    axios.delete(`/api/requests/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` } })
      .then(() => {
        setRequests((prev) => prev.filter((req) => req._id !== id));
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.message || 'Unable to delete request.');
      });
  };

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <div className="sidebar">
        <h3><i className="fas fa-ambulance"></i> HelpHub</h3>
        <a href="/"><i className="fas fa-home"></i> Home</a>
        <a href="/donate"><i className="fas fa-exclamation-triangle"></i> Post Help</a>
        <a href="/dashboard" className="active"><i className="fas fa-list"></i> All Requests</a>
        <a href="/analytics"><i className="fas fa-chart-bar"></i> Analytics</a>
        <a href="/donate"><i className="fas fa-hand-holding-heart"></i> Donate</a>
        <a href="/logout"><i className="fas fa-sign-out-alt"></i> Logout</a>
        <a href="/profile"><i className="fas fa-user"></i> Profile</a>
      </div>

      {/* Main Content */}
      <div className="main">
        <div className="topbar">
          <h2><i className="fas fa-tachometer-alt"></i> Dashboard</h2>
          <div>
            <motion.button
              className="btn btn-dark"
              onClick={toggleDarkMode}
              title="Toggle Dark Mode"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-moon"></i>
            </motion.button>
            <motion.button
              className="btn btn-warning"
              onClick={toggleMap}
              title="Toggle Map View"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-map"></i>
            </motion.button>
          </div>
        </div>

        {/* Welcome Message */}
        <motion.div
          className="welcome"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h4><i className="fas fa-hand-wave"></i> Welcome back!</h4>
          <p>Here's an overview of all help requests. Help someone in need or check your own requests.</p>
        </motion.div>

        {/* Stats */}
        <div className="stats-container">
          {[
            { icon: 'fas fa-clipboard-list', value: stats.total, label: 'Total Requests' },
            { icon: 'fas fa-clock', value: stats.pending, label: 'Pending Help' },
            { icon: 'fas fa-check-circle', value: stats.completed, label: 'Completed' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <i className={stat.icon}></i>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Map */}
        {showMap && (
          <motion.div
            id="map"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 500 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: '24px' }}
          >
            <MapContainer center={mapCenter} zoom={5} scrollWheelZoom style={{ width: '100%', height: '100%', minHeight: '450px', borderRadius: '18px' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {markers.map((marker) => (
                <Marker key={marker.id} position={marker.coords}>
                  <Popup>
                    <strong>{marker.help_type}</strong><br />Status: {marker.status}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </motion.div>
        )}

        {/* Requests Grid */}
        <div className="row">
          {requests.map((r, index) => (
            <motion.div
              key={r._id}
              className="col-md-4 mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.6 }}
            >
              <motion.div
                className={`card p-3 ${isMyRequest(r) ? 'own' : ''}`}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.div className="position-relative overflow-hidden rounded mb-3">
                  <motion.img
                    src={r.photo ? (r.photo.startsWith('data:') ? r.photo : r.photo.startsWith('http') ? r.photo : `/uploads/${r.photo}`) : fallbackRequestImage}
                    onError={(e) => { e.target.src = fallbackRequestImage; }}
                    className="img-fluid rounded"
                    alt="Request Image"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                <div className="card-body p-0">
                  <h5 className="card-title">
                    <i className="fas fa-hand-holding-heart"></i> {r.help_type}
                  </h5>

                  <p className="card-text mb-2">
                    <i className="fas fa-user-circle text-secondary"></i> Created by: {r.createdBy?.name || r.createdBy?.email || 'Anonymous'}
                  </p>
                  { (r.targetNgoName || r.targetNgoId || r.targetNgoId?.name) && (
                    <p className="card-text mb-2">
                      <i className="fas fa-hands-helping text-info"></i> Target NGO: {r.targetNgoName || r.targetNgoId?.name || 'Unknown NGO'}
                    </p>
                  ) }
                  <p className="card-text mb-2">
                    <i className="fas fa-map-marker-alt text-danger"></i> {r.location}
                  </p>
                  <p className="card-text mb-2">
                    <i className="fas fa-phone text-primary"></i> {r.contact}
                  </p>

                  {/* Priority */}
                  <span className={`priority ${r.priority?.toLowerCase() || 'low'}`}>
                    <i className={`fas fa-exclamation${r.priority === 'High' ? '' : r.priority === 'Medium' ? '-triangle' : ''}`}></i> {r.priority || 'Low'}
                  </span>

                  <div className="mt-3">                  
                    {r.status === 'Pending' && !isMyRequest(r) && (
                      <motion.button
                        onClick={() => acceptHelp(r._id)}
                        className="btn btn-primary btn-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="fas fa-handshake"></i> Accept Help
                      </motion.button>
                    )}

                    {r.completedBy && r.status === 'Completed' && (
                      <Link
                        to={`/chat/${r._id}`}
                        className="btn btn-success btn-sm ms-2"
                      >
                        <i className="fas fa-comments"></i> Chat with {r.completedBy.name || 'helper'}
                      </Link>
                    )}

                    {isMyRequest(r) && (
                      <>
                        <span className="badge bg-info ms-2">
                          <i className="fas fa-user"></i> Your Request
                        </span>
                        <motion.button
                          onClick={() => deleteRequest(r._id)}
                          className="btn btn-danger btn-sm ms-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <i className="fas fa-trash"></i> Delete
                        </motion.button>
                      </>
                    )}
                  </div>

                  <div className="mt-2">
                    {r.status === 'Pending' ? (
                      <span className="badge bg-danger">
                        <i className="fas fa-clock"></i> Pending
                      </span>
                    ) : (
                      <span className="badge bg-success">
                        <i className="fas fa-check"></i> Completed
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
