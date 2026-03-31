// src/components/Navbar.js - ESLint FIXED
import React, { useState } from 'react';  // ✅ Added useState import
import { Link, useNavigate } from 'react-router-dom';  // ✅ Link already imported

export default function Navbar() {
  // ✅ ALL HOOKS AT TOP (before any early returns)
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!token;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav style={{
      background: 'white', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
      padding: '16px 0', 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: '34px', fontWeight: '800', color: '#111827', textDecoration: 'none' }}>
           HelpHub
        </Link>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {/* Public Links */}
          <Link to="/donate" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>
            Donate
          </Link>
          
          {isLoggedIn ? (
            <>
              {/* Desktop: Show all links */}
              <Link to="/request-help" style={{ color: '#111827', textDecoration: 'none', fontWeight: '500' }}>
                Request Help
              </Link>
              <Link to="/status" style={{ color: '#10b981', textDecoration: 'none', fontWeight: '500' }}>
                📊 Status
              </Link>
              <Link to="/profile" style={{ color: '#8b5cf6', textDecoration: 'none', fontWeight: '500' }}>
                👤 Profile
              </Link>
              
              <span style={{ color: '#6b7280', fontSize: '14px' }}>
                👋 {userData.name || userData.email}
              </span>
              
              <button 
                onClick={handleLogout}
                style={{
                  background: '#ef4444', 
                  color: 'white', 
                  padding: '10px 20px',
                  border: 'none', 
                  borderRadius: '8px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>
                Login
              </Link>
              <Link to="/signup" style={{ 
                background: '#3b82f6', 
                color: 'white', 
                padding: '10px 20px',
                textDecoration: 'none', 
                borderRadius: '8px', 
                fontWeight: '600'
              }}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}