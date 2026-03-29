// src/pages/Dashboard.js - FULL FEATURES
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout, isLoggedIn } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock help requests data
    setRequests([
      {
        id: 1,
        type: 'food',
        title: 'Food for 4 family members',
        location: 'Bhubaneswar, Patia',
        description: 'Immediate food help needed for family of 4',
        contact: '7894561230',
        priority: 'Urgent',
        time: '2 hours ago'
      },
      {
        id: 2,
        type: 'medicine',
        title: 'Medicine for elderly',
        location: 'Bhubaneswar, Nayapalli',
        description: 'Paracetamol needed urgently',
        contact: '9876543210',
        priority: 'High',
        time: '5 hours ago'
      },
      {
        id: 3,
        type: 'clothes',
        title: 'Winter clothes for kids',
        location: 'Cuttack',
        description: 'Warm clothes for 2 kids aged 5-8',
        contact: '8765432109',
        priority: 'Medium',
        time: '1 day ago'
      }
    ]);
    setLoading(false);
  }, []);

 // In Dashboard.js - UPDATE handleHelp function:
    const handleHelp = (request) => {
    // Mark as resolved (remove from list)
    setRequests(prev => prev.filter(r => r.id !== request.id));
    
    alert(`✅ "${request.title}" marked RESOLVED!\nContact: ${request.contact}\nThank you ${user?.name}! 🎉`);
    };

  if (!isLoggedIn) return <div>Please log in</div>;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', margin: 0 }}>
            HelpHub Dashboard
          </h1>
          <p style={{ color: '#6b7280', fontSize: '18px', margin: '8px 0 0 0' }}>
            Hi, <strong>{user?.name}</strong>! Ready to help?
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link 
            to="/request-help"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '600',
              boxShadow: '0 4px 14px rgba(102,126,234,0.4)'
            }}
          >
            + Request Help
          </Link>
          <button
            onClick={logout}
            style={{
              background: '#f3f4f6',
              color: '#374151',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* ✅ HELP REQUESTS LIST */}
      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>
            Help Requests Near You ({requests.length})
          </h2>
          <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>Browse and help those in need</p>
        </div>

        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {requests.map((request) => (
            <div key={request.id} style={{
              padding: '24px 32px',
              borderBottom: '1px solid #f3f4f6',
              display: 'flex',
              gap: '24px',
              alignItems: 'flex-start'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                background: request.priority === 'Urgent' ? '#fef2f2' : 
                           request.priority === 'High' ? '#fef3c7' : '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                color: request.priority === 'Urgent' ? '#dc2626' : 
                      request.priority === 'High' ? '#d97706' : '#16a34a'
              }}>
                {request.type === 'food' ? '🍚' :
                 request.type === 'clothes' ? '👕' :
                 request.type === 'medicine' ? '💊' :
                 request.type === 'blood' ? '🩸' :
                 request.type === 'animal_rescue' ? '🐕' : '🙏'}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{
                    background: '#eff6ff',
                    color: '#1e40af',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {request.type.replace('_', ' ').toUpperCase()}
                  </span>
                  <span style={{
                    color: request.priority === 'Urgent' ? '#dc2626' : 
                          request.priority === 'High' ? '#d97706' : '#059669',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    {request.priority}
                  </span>
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: '0 0 4px 0' }}>
                  {request.title}
                </h3>
                <p style={{ color: '#6b7280', margin: '0 0 12px 0', fontSize: '16px' }}>
                  {request.description}
                </p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#374151' }}>
                  <span>📍 {request.location}</span>
                  <span>📞 {request.contact}</span>
                  <span style={{ color: '#6b7280' }}>{request.time}</span>
                </div>
              </div>

              {/* ✅ HELP BUTTON */}
              <button
                onClick={() => handleHelp(request)}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '16px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.4)';
                }}
              >
                I Can Help!
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}