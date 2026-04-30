import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const requestTypes = [
  { id: 'Medical', label: 'Medical Emergency', icon: 'fa-ambulance', color: '#ef4444' },
  { id: 'Food', label: 'Food Crisis', icon: 'fa-utensils', color: '#f59e0b' },
  { id: 'Rescue', label: 'Rescue Required', icon: 'fa-life-ring', color: '#3b82f6' },
  { id: 'Shelter', label: 'Shelter/Housing', icon: 'fa-home', color: '#10b981' },
  { id: 'NGO', label: 'General NGO Aid', icon: 'fa-building', color: '#6366f1' },
  { id: 'Other', label: 'Other Help', icon: 'fa-ellipsis-h', color: '#64748b' },
];

export default function Request() {
  const navigate = useNavigate();
  const [ngos, setNgos] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('helphub_user') || '{}');

  const [form, setForm] = useState({ 
    help_type: 'Medical', 
    description: '', 
    location: '', 
    contact: '', 
    email: currentUser.email || '', 
    priority: 'Medium', 
    photo: '', 
    targetNgoId: '', 
    targetNgoName: '' 
  });
  const [status, setStatus] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/ngos', { headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` } })
      .then((res) => setNgos(res.data))
      .catch(() => setNgos([]));
  }, []);

  const setLocationFromBrowser = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude.toFixed(6)},${pos.coords.longitude.toFixed(6)}`;
        setForm(prev => ({ ...prev, location: coords }));
      },
      () => alert('Unable to fetch location automatically'),
      { timeout: 10000 }
    );
  };

  const handlePhoto = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setForm(prev => ({ ...prev, photo: e.target.result.toString() }));
      setPhotoPreview(e.target.result.toString());
    };
    reader.readAsDataURL(file);
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/requests', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` },
      });
      setStatus('success');
      window.alert('Successfully requested');
      
      if (currentUser.role === 'ngo') {
        navigate('/ngo-dashboard');
      } else if (currentUser.role === 'volunteer') {
        navigate('/volunteer-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setStatus('error');
      setErrors({ submit: err.response?.data?.message || 'Failed to post request. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '4rem 1rem'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'inline-flex', padding: '16px', borderRadius: '24px', background: 'white', color: 'var(--danger)', fontSize: '2.5rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow-lg)' }}>
            <i className="fas fa-bullhorn"></i>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '1rem' }}>
            Request <span style={{ color: 'var(--danger)' }}>Urgent</span> Help
          </motion.h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Post your emergency details. Our network of volunteers and NGOs will be notified instantly.
          </p>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="glass" 
          style={{ padding: '3rem', borderRadius: '40px', background: 'rgba(255, 255, 255, 0.7)' }}
        >
          {status === 'success' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: '#f0fdf4', border: '1px solid #10b981', borderRadius: '24px', padding: '1.5rem', textAlign: 'center', marginBottom: '2.5rem', color: '#166534', fontWeight: 700 }}>
              <i className="fas fa-check-circle me-2"></i> Help is on the way! Redirecting to dashboard...
            </motion.div>
          )}
          {errors.submit && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: '#fef2f2', border: '1px solid #ef4444', borderRadius: '24px', padding: '1.5rem', textAlign: 'center', marginBottom: '2.5rem', color: '#b91c1c', fontWeight: 700 }}>
              <i className="fas fa-exclamation-circle me-2"></i> {errors.submit}
            </motion.div>
          )}

          <form onSubmit={submitRequest}>
            <div style={{ marginBottom: '3rem' }}>
              <label className="form-label-v2">Select Category</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                {requestTypes.map(type => (
                  <motion.div 
                    key={type.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setForm({ ...form, help_type: type.id })}
                    style={{ 
                      padding: '16px', 
                      borderRadius: '20px', 
                      background: form.help_type === type.id ? 'white' : 'transparent',
                      border: `2px solid ${form.help_type === type.id ? 'var(--primary)' : 'rgba(0,0,0,0.05)'}`,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                      boxShadow: form.help_type === type.id ? 'var(--shadow-md)' : 'none'
                    }}
                  >
                    <i className={`fas ${type.icon}`} style={{ fontSize: '1.5rem', color: type.color, marginBottom: '8px', display: 'block' }}></i>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)' }}>{type.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '2rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label className="form-label-v2">Description of Emergency</label>
                <textarea 
                  className="form-control-v2" 
                  rows="3" 
                  placeholder="What is happening? Provide as much detail as possible..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="form-label-v2">Location Details</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    className="form-control-v2" 
                    placeholder="Address or Coordinates"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={setLocationFromBrowser}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'var(--primary)', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    <i className="fas fa-map-marker-alt me-1"></i> Auto
                  </button>
                </div>
              </div>

              <div>
                <label className="form-label-v2">Contact Number</label>
                <input 
                  className="form-control-v2" 
                  placeholder="Your Phone Number"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="form-label-v2">Priority Level</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Low', 'Medium', 'High'].map(level => (
                    <button 
                      key={level}
                      type="button"
                      onClick={() => setForm({ ...form, priority: level })}
                      style={{ 
                        flex: 1, 
                        padding: '12px', 
                        borderRadius: '12px', 
                        border: '2px solid', 
                        borderColor: form.priority === level ? (level === 'High' ? 'var(--danger)' : level === 'Medium' ? 'var(--warning)' : 'var(--success)') : 'rgba(0,0,0,0.05)',
                        background: form.priority === level ? 'white' : 'transparent',
                        color: form.priority === level ? 'var(--text-main)' : 'var(--text-muted)',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label-v2">Who can help?</label>
                <select 
                  className="form-control-v2"
                  value={form.targetNgoId}
                  onChange={(e) => {
                    const selected = ngos.find(n => n._id === e.target.value);
                    setForm({ ...form, targetNgoId: e.target.value, targetNgoName: selected ? selected.name : '' });
                  }}
                >
                  <option value="">Broadcast to Entire Community (Citizens & Volunteers)</option>
                  <optgroup label="Direct Help from NGOs">
                    {ngos.map(ngo => <option key={ngo._id} value={ngo._id}>{ngo.name}</option>)}
                  </optgroup>
                </select>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Choose "Broadcast" to let everyone see your request, or pick a specific NGO for targeted aid.
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '3rem' }}>
              <label className="form-label-v2">Evidence / Photo (Optional)</label>
              <div style={{ 
                border: '2px dashed rgba(0,0,0,0.1)', 
                borderRadius: '20px', 
                padding: '2rem', 
                textAlign: 'center',
                background: photoPreview ? `url(${photoPreview}) center/cover` : 'white',
                position: 'relative',
                minHeight: '150px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handlePhoto(e.target.files[0])}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                />
                {!photoPreview && (
                  <div>
                    <i className="fas fa-camera" style={{ fontSize: '2rem', color: 'var(--text-muted)', marginBottom: '10px' }}></i>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 600 }}>Click to upload image</p>
                  </div>
                )}
                {photoPreview && <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }} onClick={() => setPhotoPreview('')}>×</div>}
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary" 
              style={{ width: '100%', padding: '20px', fontSize: '1.2rem', background: 'var(--danger)', boxShadow: '0 10px 20px rgba(239, 68, 68, 0.2)' }}
              disabled={loading}
            >
              {loading ? 'Posting Request...' : '🚨 BROADCAST EMERGENCY'}
            </motion.button>
          </form>
        </motion.div>
      </div>

      <style>{`
        .form-label-v2 { display: block; font-weight: 700; color: var(--text-main); margin-bottom: 8px; font-size: 0.9rem; }
        .form-control-v2 { width: 100%; padding: 14px 18px; border-radius: 12px; border: 2px solid rgba(0,0,0,0.05); background: white; font-family: inherit; font-size: 1rem; transition: all 0.2s; }
        .form-control-v2:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-glow); }
      `}</style>
    </div>
  );
}
