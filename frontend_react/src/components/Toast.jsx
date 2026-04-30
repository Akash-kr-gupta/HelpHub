import React from 'react';

export default function Toast({ message, show, onClose }) {
  if (!show) return null;
  return (
    <div style={{
      position: 'fixed',
      bottom: 30,
      right: 30,
      background: '#333',
      color: '#fff',
      padding: '16px 32px',
      borderRadius: 8,
      zIndex: 9999,
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      minWidth: 200,
      fontSize: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }}>
      <span>{message}</span>
      <button onClick={onClose} style={{
        background: 'transparent',
        border: 'none',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        marginLeft: 12,
        cursor: 'pointer'
      }}>&times;</button>
    </div>
  );
}
