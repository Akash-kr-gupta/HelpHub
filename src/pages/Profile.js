// src/pages/Profile.js - ESLINT FIXED & COMPLETE
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Dummy stats (replace with real API later)
const PROFILE_STATS = {
  total_requests: 3,
  completed_requests: 2,
  donations: 5,
};

export default function Profile() {
  // ✅ ALL HOOKS FIRST (before ANY auth check)
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  // ✅ Auth check + load data in useEffect
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    // Load form data from localStorage
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'User'
    });
  }, [token, navigate, user]);

  const formattedDate = new Date(user?.createdAt || Date.now())
    .toLocaleDateString('en-IN');

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEditMode(false);
      alert('✅ Profile updated!');
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // ✅ Early return AFTER all hooks
  if (!token) return null;

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '40px 20px', 
      background: '#f8fafc',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        background: 'white', 
        borderRadius: '16px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '40px', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '32px', margin: 0, fontWeight: '700' }}>
            👤 My Profile
          </h1>
          <p style={{ opacity: 0.9, margin: '8px 0 0' }}>
            Manage your HelpHub account
          </p>
        </div>

        {/* Personal Info */}
        <div style={{ padding: '40px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '24px' 
          }}>
            <h3 style={{ fontSize: '24px', color: '#111827', margin: 0 }}>
              Personal Info
            </h3>
            <button 
              onClick={handleEditToggle}
              style={{
                background: editMode ? '#ef4444' : '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                Full Name
              </label>
              {editMode ? (
                <input 
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%', padding: '12px', border: '2px solid #e5e7eb',
                    borderRadius: '8px', fontSize: '16px'
                  }}
                />
              ) : (
                <p style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
                  {formData.name || user.name || 'Not set'}
                </p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                Email
              </label>
              <p style={{ fontSize: '16px', margin: 0, color: '#111827' }}>
                {formData.email || user.email || 'Not set'}
              </p>
            </div>

            <div>
              <label style={{ display: 'block', color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                Phone
              </label>
              {editMode ? (
                <input 
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%', padding: '12px', border: '2px solid #e5e7eb',
                    borderRadius: '8px', fontSize: '16px'
                  }}
                />
              ) : (
                <p style={{ fontSize: '16px', margin: 0 }}>
                  {formData.phone || user.phone || 'Not set'}
                </p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                Role
              </label>
              <p style={{ fontSize: '16px', margin: 0 }}>
                {formData.role || user.role || 'User'}
              </p>
            </div>
          </div>

          <p style={{ margin: '16px 0 0', color: '#6b7280', fontSize: '14px' }}>
            Joined: <strong>{formattedDate}</strong>
          </p>
        </div>

        {/* Activity Stats */}
        <div style={{ padding: '0 40px 40px' }}>
          <h3 style={{ fontSize: '24px', color: '#111827', margin: '40px 0 24px' }}>
            📊 Your Activity
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', color: '#10b981', marginBottom: '8px' }}>
                {PROFILE_STATS.total_requests}
              </div>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 4px' }}>
                Total Requests
              </p>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                {PROFILE_STATS.completed_requests} completed
              </p>
            </div>
            <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', color: '#f59e0b', marginBottom: '8px' }}>
                {PROFILE_STATS.donations}
              </div>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 4px' }}>
                Donations
              </p>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                Items/Blood donated
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          padding: '0 40px 40px',
          borderTop: '1px solid #e5e7eb'
        }}>
          {editMode && (
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              marginBottom: '20px'
            }}>
              <button 
                onClick={handleSave}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '💾 Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link 
              to="/status"
              style={{
                flex: 1,
                padding: '14px',
                background: '#3b82f6',
                color: 'white',
                textAlign: 'center',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '16px'
              }}
            >
              📊 View My Requests
            </Link>
            <button 
              onClick={handleLogout}
              style={{
                flex: 1,
                padding: '14px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}