import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const donationTypes = [
  { id: 'Money', label: 'Financial Support', icon: 'fa-rupee-sign', color: '#10b981', desc: 'Direct funding for urgent needs' },
  { id: 'Food', label: 'Food & Meals', icon: 'fa-utensils', color: '#f59e0b', desc: 'Meals for the hungry' },
  { id: 'Medical Supplies', label: 'Medical Kits', icon: 'fa-briefcase-medical', color: '#ef4444', desc: 'Life-saving medicines' },
  { id: 'Clothes', label: 'Clothing', icon: 'fa-tshirt', color: '#3b82f6', desc: 'Wearables for the needy' },
  { id: 'Blood', label: 'Blood Donation', icon: 'fa-tint', color: '#dc2626', desc: 'Critical life support' },
  { id: 'Other', label: 'Other Items', icon: 'fa-box-open', color: '#64748b', desc: 'Misc. essential goods' },
];

export default function Donate() {
  const [ngos, setNgos] = useState([]);
  const [form, setForm] = useState({ 
    name: '', 
    donationType: 'Money', 
    item: '', 
    amount: '', 
    quantity: '', 
    contact: '', 
    address: '', 
    message: '', 
    ngoId: '', 
    ngoName: '' 
  });
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);

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
        setForm(prev => ({ ...prev, address: coords }));
      },
      () => alert('Unable to fetch location automatically'),
      { timeout: 10000 }
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.contact.trim()) newErrors.contact = 'Contact info is required';
    
    if (form.donationType === 'Money') {
      if (!form.amount || parseFloat(form.amount) <= 0) newErrors.amount = 'Valid amount required';
    } else {
      if (!form.item.trim() && (form.donationType === 'Other' || form.donationType === 'Medical Supplies')) newErrors.item = 'Item details required';
      if (!form.quantity.trim()) newErrors.quantity = 'Quantity is required';
      if (!form.address.trim()) newErrors.address = 'Pickup address required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post('/api/donations', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` }
      });
      setStatus('success');
      setShowToast(true);
      setForm({ name: '', donationType: 'Money', item: '', amount: '', quantity: '', contact: '', address: '', message: '', ngoId: '', ngoName: '' });
      setErrors({});
      setTimeout(() => setShowToast(false), 5000);
    } catch (err) {
      setStatus('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  return (
    <div className="donate-page-v2" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '4rem 1rem'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'inline-flex', padding: '16px', borderRadius: '24px', background: 'white', color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow-lg)' }}>
            <i className="fas fa-hand-holding-heart"></i>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '1rem' }}>
            Transform a Life <span className="text-gradient">Today</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Your small contribution can be a huge blessing for someone in need. Join our network of verified donors.
          </motion.p>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="glass" 
          style={{ padding: '3rem', borderRadius: '40px', background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(255, 255, 255, 0.5)' }}
        >
          <AnimatePresence mode="wait">
            {status === 'success' && showToast && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} style={{ background: '#ecfdf5', border: '1px solid #10b981', borderRadius: '24px', padding: '2rem', textAlign: 'center', marginBottom: '2.5rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#10b981', fontSize: '3rem', marginBottom: '1rem' }}></i>
                <h3 style={{ color: '#065f46', fontWeight: 800 }}>Thank You for Your Generosity!</h3>
                <p style={{ color: '#047857', margin: 0 }}>Our volunteers will contact you shortly to coordinate the donation.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={submit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '2.5rem' }}>
              <div>
                <label className="form-label-v2">Your Name</label>
                <input
                  type="text"
                  className={`form-control-v2 ${errors.name ? 'error' : ''}`}
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
                {errors.name && <small style={{ color: 'var(--danger)', marginTop: '4px', display: 'block' }}>{errors.name}</small>}
              </div>
              <div>
                <label className="form-label-v2">Contact Details</label>
                <input
                  type="text"
                  className={`form-control-v2 ${errors.contact ? 'error' : ''}`}
                  placeholder="Email or Phone"
                  value={form.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                />
                {errors.contact && <small style={{ color: 'var(--danger)', marginTop: '4px', display: 'block' }}>{errors.contact}</small>}
              </div>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <label className="form-label-v2" style={{ marginBottom: '1.5rem' }}>Select Donation Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {donationTypes.map(type => (
                  <motion.div 
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange('donationType', type.id)}
                    style={{ 
                      padding: '20px', 
                      borderRadius: '24px', 
                      background: form.donationType === type.id ? 'white' : 'transparent',
                      border: `2px solid ${form.donationType === type.id ? 'var(--primary)' : 'rgba(0,0,0,0.05)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: form.donationType === type.id ? 'var(--shadow-md)' : 'none',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${type.color}15`, color: type.color, display: 'flex', alignItems: 'center', justifyCenter: 'center', margin: '0 auto 12px' }}>
                      <i className={`fas ${type.icon}`} style={{ margin: 'auto' }}></i>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: form.donationType === type.id ? 'var(--primary)' : 'var(--text-main)' }}>{type.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {form.donationType === 'Money' ? (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} key="money" style={{ marginBottom: '2.5rem' }}>
                  <label className="form-label-v2">Amount (₹)</label>
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-rupee-sign" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--success)' }}></i>
                    <input
                      type="number"
                      className={`form-control-v2 ${errors.amount ? 'error' : ''}`}
                      style={{ paddingLeft: '45px' }}
                      placeholder="Enter amount"
                      value={form.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                    />
                  </div>
                  {errors.amount && <small style={{ color: 'var(--danger)', marginTop: '4px', display: 'block' }}>{errors.amount}</small>}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} key="physical" style={{ marginBottom: '2.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                    <div>
                      <label className="form-label-v2">Item Details</label>
                      <input
                        type="text"
                        className={`form-control-v2 ${errors.item ? 'error' : ''}`}
                        placeholder="What are you giving?"
                        value={form.item}
                        onChange={(e) => handleInputChange('item', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label-v2">Quantity</label>
                      <input
                        type="text"
                        className={`form-control-v2 ${errors.quantity ? 'error' : ''}`}
                        placeholder="e.g. 10 packets"
                        value={form.quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                      />
                    </div>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <textarea
                      className={`form-control-v2 ${errors.address ? 'error' : ''}`}
                      rows="2"
                      placeholder="Where should we pick it up from?"
                      value={form.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      style={{ resize: 'none', paddingRight: '70px' }}
                    ></textarea>
                    <button 
                      type="button" 
                      onClick={setLocationFromBrowser}
                      style={{ position: 'absolute', right: '10px', top: '10px', border: 'none', background: 'var(--primary)', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      <i className="fas fa-map-marker-alt me-1"></i> Auto
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ marginBottom: '2.5rem' }}>
              <label className="form-label-v2">Target NGO (Optional)</label>
              <select
                className="form-control-v2"
                value={form.ngoId}
                onChange={(e) => {
                  const selected = ngos.find(n => n._id === e.target.value);
                  setForm({ ...form, ngoId: e.target.value, ngoName: selected ? selected.name : '' });
                }}
              >
                <option value="">Global Relief Pool</option>
                {ngos.map(ngo => <option key={ngo._id} value={ngo._id}>{ngo.name}</option>)}
              </select>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              style={{ 
                width: '100%', 
                padding: '20px', 
                borderRadius: '24px', 
                border: 'none', 
                background: 'var(--primary)', 
                color: 'white', 
                fontWeight: 800, 
                fontSize: '1.25rem',
                cursor: 'pointer',
                boxShadow: '0 12px 24px var(--primary-glow)'
              }}
            >
              Confirm Donation
            </motion.button>
          </form>
        </motion.div>
      </div>

      <style>{`
        .form-label-v2 {
          display: block;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 8px;
          font-size: 0.95rem;
        }
        .form-control-v2 {
          width: 100%;
          padding: 16px 20px;
          border-radius: 16px;
          border: 2px solid rgba(0,0,0,0.05);
          background: white;
          font-family: inherit;
          font-size: 1rem;
          transition: all 0.2s;
        }
        .form-control-v2:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px var(--primary-glow);
        }
        .form-control-v2.error {
          border-color: var(--danger);
        }
      `}</style>
    </div>
  );
}
