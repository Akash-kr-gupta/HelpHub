// src/pages/HelpList.js - MARK RESOLVED
import React, { useState, useEffect } from 'react';

export default function HelpList() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    setRequests([
      { 
        id: 1, 
        title: 'Food needed', 
        type: 'food', 
        location: 'Bhubaneswar',
        resolved: false
      },
      { 
        id: 2, 
        title: 'Medicine urgent', 
        type: 'medicine', 
        location: 'Cuttack',
        resolved: false
      },
    ]);
  }, []);

  const markResolved = (id) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === id ? { ...req, resolved: true } : req
      ).filter(req => !req.resolved)  // Remove resolved
    );
    // Show success
    alert('✅ Request marked as RESOLVED! Thank you for helping!');
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', textAlign: 'center', color: '#111827', marginBottom: '20px' }}>
        Active Help Requests
      </h1>
      
      {requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
          <h2>🎉 All requests resolved!</h2>
          <p>Great job helping the community!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '24px' }}>
          {requests.map((req) => (
            <div key={req.id} style={{
              padding: '24px',
              border: '2px solid #e5e7eb',
              borderRadius: '16px',
              background: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 8px 0' }}>
                    {req.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '12px', color: '#6b7280' }}>
                    <span>📍 {req.location}</span>
                    <span>🏷️ {req.type}</span>
                  </div>
                </div>
                
                {/* ✅ RESOLVE BUTTON */}
                <button
                  onClick={() => markResolved(req.id)}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '12px 28px',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(16,185,129,0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(16,185,129,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 14px rgba(16,185,129,0.4)';
                  }}
                >
                  I Can Help!
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}