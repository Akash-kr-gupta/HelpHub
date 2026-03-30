import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function Donate() {
  const [ngos, setNgos] = useState([]);
  const [form, setForm] = useState({ name: '', item: '', amount: '', ngoId: '', ngoName: '' });
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    axios.get('/api/ngos', { headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` } })
      .then((res) => setNgos(res.data))
      .catch(() => setNgos([]));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Please enter your name.';
    if (!form.item.trim()) newErrors.item = 'Please specify the item.';
    if (!form.amount || parseFloat(form.amount) <= 0) newErrors.amount = 'Please add a valid amount (at least 1).';
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
      setForm({ name: '', item: '', amount: '' });
      setErrors({});

      setTimeout(() => {
        setShowToast(false);
        // Could navigate to analytics or dashboard
      }, 3500);
    } catch (err) {
      setStatus('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    }
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="page donate-page">
      <motion.div
        className="donate-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="donate-header">
          <div>
            <h2 className="fw-bold mb-2">Make a Donation</h2>
            <p className="text-muted">Your contribution powers lifesaving responses.</p>
          </div>
          <span className="badge bg-success fs-6">NGO-friendly</span>
        </div>

        {status === 'success' && showToast && (
          <motion.div
            className="toast status-toast"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="toast-body">Thank you for your donation! 🌟</div>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowToast(false)}
            ></button>
          </motion.div>
        )}

        {status === 'error' && showToast && (
          <motion.div
            className="toast status-toast error"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="toast-body">Something went wrong. Please try again.</div>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowToast(false)}
            ></button>
          </motion.div>
        )}

        <form onSubmit={submit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="donorName" className="form-label">Name</label>
              <motion.input
                id="donorName"
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                whileFocus={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="donationItem" className="form-label">Item</label>
              <motion.input
                id="donationItem"
                type="text"
                className={`form-control ${errors.item ? 'is-invalid' : ''}`}
                placeholder="What are you donating?"
                value={form.item}
                onChange={(e) => handleInputChange('item', e.target.value)}
                whileFocus={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
              />
              {errors.item && <div className="invalid-feedback">{errors.item}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="donationAmount" className="form-label">Amount (₹)</label>
              <motion.input
                id="donationAmount"
                type="number"
                min="1"
                className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                placeholder="0"
                value={form.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                whileFocus={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
              />
              {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="donorNgo" className="form-label">Donate To NGO (optional)</label>
              <select
                id="donorNgo"
                className="form-control"
                value={form.ngoId}
                onChange={(e) => {
                  const selected = ngos.find((n) => n._id === e.target.value);
                  setForm((prev) => ({
                    ...prev,
                    ngoId: e.target.value,
                    ngoName: selected ? selected.name : '',
                  }));
                }}
              >
                <option value="">Direct to community (no NGO)</option>
                {ngos.map((ngo) => (
                  <option key={ngo._id} value={ngo._id}>{ngo.name || ngo.email}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6 d-flex align-items-end">
              <motion.button
                type="submit"
                className="btn btn-primary w-100"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Donate Now
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
