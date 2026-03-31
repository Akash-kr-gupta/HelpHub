// src/pages/Status.js - USER REQUESTS + RESOLVED HISTORY
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Status() {
  const { user } = useAuth();
  const [myRequests, setMyRequests] = useState([]);
  const [helpedRequests, setHelpedRequests] = useState([]);

  useEffect(() => {
    // Mock user's data (in production: fetch from API)
    setMyRequests([
      {
        id: 101,
        title: 'Food for family',
        type: 'food',
        location: 'Bhubaneswar, Patia',
        status: 'Pending',
        date: 'Today, 2:30 PM',
        priority: 'Urgent'
      },
      {
        id: 102,
        title: 'Medicine needed',
        type: 'medicine',
        location: 'Cuttack',
        status: 'Resolved ✅',
        date: 'Yesterday, 10:15 AM',
        priority: 'High'
      }
    ]);

    setHelpedRequests([
      {
        id: 1,
        title: 'Food for 4 family members',
        type: 'food',
        location: 'Bhubaneswar, Nayapalli',
        helpedDate: 'Today, 3:45 PM',
        helperName: user?.name || 'You'
      },
      {
        id: 2,
        title: 'Winter clothes for kids',
        type: 'clothes',
        location: 'Bhubaneswar, Saheed Nagar',
        helpedDate: '2 days ago',
        helperName: user?.name || 'You'
      }
    ]);
  }, [user]);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', margin: 0 }}>
            My Status
          </h1>
          <p style={{ color: '#6b7280', fontSize: '18px', margin: '8px 0 0 0' }}>
            Track your requests and help history, {user?.name}
          </p>
        </div>
        <Link 
          to="/request-help"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '600'
          }}
        >
          + New Request
        </Link>
      </div>

      {/* ✅ MY REQUESTS SECTION */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
            My Requests ({myRequests.length})
          </h2>
        </div>
        
        {myRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
            <p style={{ fontSize: '18px' }}>No requests yet</p>
            <Link to="/request-help" style={{ color: '#667eea', fontWeight: '600' }}>
              Create your first request
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {myRequests.map((req) => (
              <div key={req.id} style={{
                padding: '24px',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                background: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: '0 0 4px 0' }}>
                      {req.title}
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', color: '#6b7280', fontSize: '14px' }}>
                      <span>{req.location}</span>
                      <span>{req.type}</span>
                      <span>{req.date}</span>
                    </div>
                  </div>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: req.status === 'Resolved ✅' ? '#059669' : '#d97706',
                    background: req.status === 'Resolved ✅' ? '#f0fdf4' : '#fef3c7'
                  }}>
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ HELPED REQUESTS SECTION */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
            Helped Requests ({helpedRequests.length})
          </h2>
        </div>
        
        {helpedRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
            <p style={{ fontSize: '18px' }}>No help provided yet</p>
            <Link to="/dashboard" style={{ color: '#667eea', fontWeight: '600' }}>
              Browse requests to help
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {helpedRequests.map((req) => (
              <div key={req.id} style={{
                padding: '24px',
                border: '2px solid #10b981',
                borderRadius: '16px',
                background: 'white',
                boxShadow: '0 4px 12px rgba(16,185,129,0.15)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#059669', margin: '0 0 8px 0' }}>
                      ✅ {req.title}
                    </h3>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>
                      <span>{req.location}</span> • <span>{req.type}</span>
                    </div>
                  </div>
                  <span style={{
                    background: '#dcfce7',
                    color: '#166534',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    Helped {req.helpedDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}