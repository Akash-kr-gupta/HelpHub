import React from 'react';
import { Link } from 'react-router-dom';

export default function AnimalRescue() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', textAlign: 'center', color: '#111827' }}>
        🐾 Animal Rescue
      </h1>
      <p style={{ fontSize: '18px', textAlign: 'center', color: '#6b7280' }}>
        Report stray animals or offer help
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '40px' }}>
        <Link to="/request-help" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
            border: '2px solid #10b981',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🐕</div>
            <h3 style={{ color: '#111827', marginBottom: '8px' }}>Report Stray</h3>
            <p style={{ color: '#6b7280' }}>Found injured animal?</p>
          </div>
        </Link>
        
        <Link to="/help-list" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
            border: '2px solid #3b82f6',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❤️</div>
            <h3 style={{ color: '#111827', marginBottom: '8px' }}>Help Animals</h3>
            <p style={{ color: '#6b7280' }}>Browse rescue requests</p>
          </div>
        </Link>
      </div>
    </div>
  );
}