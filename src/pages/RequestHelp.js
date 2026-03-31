// src/pages/RequestHelp.js - FULLY FIXED
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const HELP_TYPES = [
  { value: "food", label: "Food" },
  { value: "clothes", label: "Clothes" },
  { value: "medicine", label: "Medicine" },
  { value: "blood", label: "Blood Request" },
  { value: "animal_rescue", label: "Animal Rescue" },
  { value: "general", label: "General Help" },
];

export default function RequestHelp() {
  // ✅ CHECK TOKEN DIRECTLY (no AuthContext needed)
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!token;
  
  const [form, setForm] = useState({
    type: "general",
    description: "",
    location: "",
    contact: "",
    priority: "Medium",
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const locationInputRef = useRef(null);
  const navigate = useNavigate();

  // ✅ SHOW LOGIN MESSAGE IF NO TOKEN
  if (!isLoggedIn) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px',
        background: '#f8fafc'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '60px 40px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <h2 style={{ color: '#ef4444', fontSize: '28px', marginBottom: '16px' }}>
            🔒 Please Login
          </h2>
          <p style={{ color: '#6b7280', fontSize: '18px', marginBottom: '24px' }}>
            You need to login to request help
          </p>
          <a 
            href="/login" 
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
              display: 'inline-block'
            }}
          >
            Go to Login →
          </a>
          <div style={{ marginTop: '24px', fontSize: '14px', color: '#9ca3af' }}>
            Token missing. Login saves token to localStorage.
          </div>
        </div>
      </div>
    );
  }

  // ✅ AUTO GPS LOCATION
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          const location = data.display_name || 
                          `${data.address?.city || 'Area'}, ${data.address?.state || ''}`;
          
          setForm(prev => ({ ...prev, location }));
          locationInputRef.current?.focus();
          alert(`📍 Location detected: ${location}`);
        } catch (error) {
          setForm(prev => ({ 
            ...prev, 
            location: `Lat: ${position.coords.latitude.toFixed(2)}, Lng: ${position.coords.longitude.toFixed(2)}`
          }));
          alert('📍 GPS coordinates captured!');
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        setLocating(false);
        alert('GPS access denied. Please enter location manually.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.description.trim()) newErrors.description = "Description required";
    if (!form.location.trim()) newErrors.location = "Location required";
    if (!form.contact.trim()) newErrors.contact = "Contact required";
    if (!photo) newErrors.photo = "📸 Photo proof REQUIRED";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ REAL BACKEND SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('type', form.type);
      formData.append('description', form.description);
      formData.append('location', form.location);
      formData.append('contact', form.contact);
      formData.append('priority', form.priority);
      formData.append('photo', photo);
      
      const response = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        alert('✅ Request submitted successfully!');
        navigate("/status");
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px 0', background: 'white' }}>
      <div style={{ 
        maxWidth: '500px', 
        margin: '0 auto', 
        padding: '40px 24px', 
        background: 'white', 
        borderRadius: '16px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)' 
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: '8px' }}>
          Request Help
        </h2>
        <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '32px' }}>
          Welcome {user.name || user.email} 👋
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Type */}
          <div>
            <label style={{ fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
              Type of Help
            </label>
            <select name="type" value={form.type} onChange={handleChange} disabled={loading}
              style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '16px', background: '#f9fafb' }}>
              {HELP_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label style={{ fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
              Description <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea name="description" rows="4" value={form.description} onChange={handleChange} disabled={loading}
              style={{ width: '100%', padding: '12px 16px', border: errors.description ? '2px solid #ef4444' : '2px solid #e5e7eb', borderRadius: '12px', fontSize: '16px', background: '#f9fafb', resize: 'vertical' }}
              placeholder="Describe your situation..." />
            {errors.description && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.description}</p>}
          </div>

          {/* Location */}
          <div>
            <label style={{ fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
              📍 Location <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input 
                ref={locationInputRef}
                name="location" 
                type="text" 
                value={form.location} 
                onChange={handleChange}
                style={{
                  flex: 1, padding: '12px 16px',
                  border: errors.location ? '2px solid #ef4444' : '2px solid #e5e7eb',
                  borderRadius: '12px', fontSize: '16px', background: '#f9fafb'
                }} 
                placeholder="Enter location or click GPS..." 
                disabled={loading || locating}
              />
              <button 
                type="button"
                onClick={detectLocation}
                disabled={loading || locating}
                style={{
                  padding: '12px 16px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: locating ? 'not-allowed' : 'pointer',
                  minWidth: '60px'
                }}
              >
                {locating ? '🔄' : '📍'}
              </button>
            </div>
            {errors.location && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.location}</p>}
            <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
              Click 📍 for auto-detection or type manually
            </p>
          </div>

          {/* Contact */}
          <div>
            <label style={{ fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
              Contact (Phone/Email) <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input 
              name="contact" 
              type="text" 
              value={form.contact} 
              onChange={handleChange} 
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                border: errors.contact ? '2px solid #ef4444' : '2px solid #e5e7eb', 
                borderRadius: '12px', 
                fontSize: '16px', 
                background: '#f9fafb' 
              }} 
              placeholder="e.g. +91 9876543210 or help@example.com"
            />
            {errors.contact && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.contact}</p>}
          </div>

          {/* Priority */}
          <div>
            <label style={{ fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
              Priority
            </label>
            <select 
              name="priority" 
              value={form.priority} 
              onChange={handleChange} 
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                border: '2px solid #e5e7eb', 
                borderRadius: '12px', 
                fontSize: '16px', 
                background: '#f9fafb' 
              }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Photo */}
          <div>
            <label style={{ fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
              Photo Proof <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoChange} 
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                border: errors.photo ? '2px solid #ef4444' : '2px solid #e5e7eb', 
                borderRadius: '12px', 
                fontSize: '16px', 
                background: '#f9fafb' 
              }}
            />
            {photoPreview && (
              <div style={{ marginTop: '12px' }}>
                <img 
                  src={photoPreview} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '150px', 
                    borderRadius: '8px', 
                    border: '1px solid #e5e7eb' 
                  }} 
                />
              </div>
            )}
            {errors.photo && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.photo}</p>}
          </div>

          {/* Submit */}
          <div style={{ marginTop: '16px' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '16px 24px', 
                background: `linear-gradient(135deg, #059669 ${loading ? 0 : 100}%, #047857 100%)`, 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                fontSize: '16px', 
                fontWeight: '600', 
                cursor: loading ? 'not-allowed' : 'pointer' 
              }}
            >
              {loading ? '🚀 Submitting...' : '🚀 Submit Help Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}