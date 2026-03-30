import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function NGODashboard() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ pending: 0, completed: 0, in_progress: 0, ngos: 0, donations: 0 });
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('helphub_user') || '{}');
  const ngoUserId = currentUser?.id;

  const calculateStats = (list) => ({
    pending: list.filter((r) => r.status === 'Pending').length,
    completed: list.filter((r) => r.status === 'Completed').length,
    in_progress: list.filter((r) => r.status === 'In Progress' || r.status === 'Pending').length,
  });

  const refreshRequests = async () => {
    setLoading(true);
    try {
      const resp = await axios.get('/api/requests', { headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` } });
      const data = resp.data;
      setRequests(data);
      setStats((prev) => ({ ...prev, ...calculateStats(data) }));
    } catch (err) {
      console.error('Unable to load NGO requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRequests();
    axios.get('/api/analytics', { headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` } })
      .then((resp) => setStats((p) => ({ ...p, ngos: resp.data.ngos || 0, donations: resp.data.donations || 0 })))
      .catch(() => {});
  }, []);

  const accept = async (id) => {
    try {
      await axios.put(`/api/requests/${id}/accept`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` } });
      refreshRequests();
    } catch (err) {
      console.error('Accept error', err);
      alert('Unable to mark request completed.');
    }
  };

  const assignToMe = async (id) => {
    try {
      await axios.put(`/api/requests/${id}/accept`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` } });
      refreshRequests();
    } catch (err) {
      console.error('Assign error', err);
      alert('Unable to assign this request.');
    }
  };

  const ngoRequests = requests.filter((r) => r.targetNgoId?.toString() === ngoUserId);
  const openRequests = requests.filter((r) => r.status === 'Pending');

  const displayedRequests = activeTab === 'all' ? requests : activeTab === 'mine' ? ngoRequests : openRequests;

  return (
    <div className="page ngo-page">
      <div className="ngo-top">
        <div>
          <h2>NGO Command Center</h2>
          <p>Manage donations, feed responses, and monitor community requests in real time.</p>
        </div>
        <div className="action-buttons">
          <Link to="/donate" className="btn btn-primary">Donate Resources</Link>
          <Link to="/request" className="btn btn-secondary">Create Help Request</Link>
          <button className="btn btn-info" onClick={refreshRequests}>Refresh Requests</button>
        </div>
      </div>

      <div className="stats-grid ngo-stats">
        <motion.div className="stat-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <h3>{stats.pending}</h3>
          <p>Pending Feed Calls</p>
        </motion.div>
        <motion.div className="stat-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3>{stats.completed}</h3>
          <p>Completed Operations</p>
        </motion.div>
        <motion.div className="stat-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3>{stats.donations}</h3>
          <p>Total Donations</p>
        </motion.div>
        <motion.div className="stat-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3>{stats.ngos}</h3>
          <p>NGOs Registered</p>
        </motion.div>
      </div>

      <div className="tabs">
        <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>All Requests</button>
        <button className={activeTab === 'mine' ? 'active' : ''} onClick={() => setActiveTab('mine')}>Requests For Me</button>
        <button className={activeTab === 'open' ? 'active' : ''} onClick={() => setActiveTab('open')}>Open Requests</button>
      </div>

      {loading ? (
        <div className="loading">Loading NGO requests...</div>
      ) : (
        <div className="requests-list">
          {displayedRequests.length === 0 ? (
            <div className="empty-state">No requests yet. Add a feeding mission and invite volunteers.</div>
          ) : displayedRequests.map((r) => (
            <motion.div key={r._id} className="card request-card" whileHover={{ y: -4 }}>
              <div className="request-head">
                <h4>{r.help_type}</h4>
                <span className={`badge ${r.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>{r.status}</span>
              </div>
              <p>{r.description || 'No details provided'}</p>
              <div className="meta">
                <div>Location: {r.location}</div>
                <div>Contact: {r.contact}</div>
                <div>Priority: {r.priority || 'Low'}</div>
                <div>Created by: {r.createdBy?.name || r.createdBy?.email || 'Unknown'}</div>
                {r.targetNgoName ? <div>Target NGO: {r.targetNgoName}</div> : <div>Target NGO: Any</div>}
              </div>

              <div className="request-actions">
                {r.status === 'Pending' && r.targetNgoId?.toString() !== ngoUserId && (
                  <button className="btn btn-light" onClick={() => assignToMe(r._id)}>Take on this request</button>
                )}
                {r.status === 'Pending' && r.targetNgoId?.toString() === ngoUserId && (
                  <button className="btn btn-primary" onClick={() => accept(r._id)}>Mark Completed</button>
                )}
                {r.status === 'Completed' && (
                  <span className="label-complete">Completed by {r.completedBy?.name || 'team'}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
