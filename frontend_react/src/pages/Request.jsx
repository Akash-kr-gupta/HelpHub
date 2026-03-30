import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Request() {
  const navigate = useNavigate();
  const [ngos, setNgos] = useState([]);
  const [form, setForm] = useState({ help_type: 'Medical', description: '', location: '', contact: '', priority: 'Low', photo: '', targetNgoId: '', targetNgoName: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    axios.get('/api/ngos', { headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` } })
      .then((res) => setNgos(res.data))
      .catch(() => setNgos([]));
  }, []);

  const setLocationFromBrowser = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported in this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude.toFixed(6)},${pos.coords.longitude.toFixed(6)}`;
        setForm((prev) => ({ ...prev, location: coords }));
      },
      () => {
        alert('Unable to get location. Please enter manually.');
      },
      { timeout: 10000 }
    );
  };

  const setPhoto = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setForm((prev) => ({ ...prev, photo: e.target.result.toString() }));
      }
    };
    reader.readAsDataURL(file);
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/requests', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` },
      });
      setStatus('success');
      setTimeout(() => navigate('/dashboard'), 1300);
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="page form-page">
      <motion.div
        className="card-box"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Request Emergency Help</h2>
        {status === 'success' && <div className="alert alert-success">Request submitted successfully.</div>}
        {status === 'error' && <div className="alert alert-danger">Unable to submit. Try again.</div>}
        <form onSubmit={submitRequest}>
          <select value={form.help_type} onChange={(e) => setForm({ ...form, help_type: e.target.value })} className="form-control" required>
            <option value="Medical">Medical</option>
            <option value="Food">Food</option>
            <option value="Shelter">Shelter</option>
            <option value="Rescue">Rescue</option>
            <option value="NGO">NGO</option>
            <option value="Other">Other</option>
          </select>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the emergency"
            className="form-control"
            rows="4"
            required
          />
          <div className="location-row" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Location (Lat,Long or address)"
              className="form-control"
              required
            />
            <button
              type="button"
              className="btn primary"
              onClick={setLocationFromBrowser}
              style={{ width: '42%' }}
            >
              Auto My Location
            </button>
          </div>

          <label htmlFor="targetNgo" style={{ marginTop: '10px', fontWeight: 600 }}>
            Select NGO to Assist (optional)
          </label>
          <select
            id="targetNgo"
            className="form-control"
            value={form.targetNgoId}
            onChange={(e) => {
              const selected = ngos.find((n) => n._id === e.target.value);
              setForm({
                ...form,
                targetNgoId: e.target.value,
                targetNgoName: selected ? selected.name : '',
              });
            }}
          >
            <option value="">No specific NGO</option>
            {ngos.map((ngo) => (
              <option key={ngo._id} value={ngo._id}>{ngo.name || ngo.email}</option>
            ))}
          </select>
          <input
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            placeholder="Contact number"
            className="form-control"
            required
          />

          <label htmlFor="photoUpload" style={{ marginTop: '10px', fontWeight: 600 }}>
            Upload Image (optional)
          </label>
          <input
            id="photoUpload"
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => setPhoto(e.target.files?.[0])}
          />

          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="form-control" required>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <motion.button
            type="submit"
            className="btn primary"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Submit Request
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
