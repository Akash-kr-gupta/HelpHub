// src/pages/AdminNGOs.js - COMPLETE WITH HEADER ADD NGO BUTTON
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminNGOs() {
  const navigate = useNavigate();
  const [ngos, setNgos] = useState([]);
  const [form, setForm] = useState({
    name: '', description: '', phone: '', upi: '', color: '#FF6B35', active: true
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // ✅ CHECK ADMIN LOGIN
  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin-login');
      return;
    }
    fetchNgos();
  }, [navigate]);

  // ✅ FETCH NGOS FROM FLASK API
  const fetchNgos = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/ngos');
      const data = await res.json();
      if (data.success) {
        setNgos(data.ngos || []);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Failed to load NGOs');
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADD/UPDATE NGO
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `http://localhost:5000/api/ngos/${editingId}` : 'http://localhost:5000/api/ngos';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          qr: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${form.upi}`
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setForm({ name: '', description: '', phone: '', upi: '', color: '#FF6B35', active: true });
        setEditingId(null);
        fetchNgos();
        alert(editingId ? 'NGO updated!' : 'NGO added!');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Network error: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // ✅ DELETE NGO
  const deleteNgo = async (id) => {
    if (window.confirm('Delete this NGO?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/ngos/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          fetchNgos();
          alert('NGO deleted!');
        } else {
          alert('Error: ' + data.error);
        }
      } catch (error) {
        alert('Delete error: ' + error.message);
      }
    }
  };

  // ✅ EDIT NGO
  const editNgo = (ngo) => {
    setForm(ngo);
    setEditingId(ngo._id || ngo.id);
  };

  // ✅ NEW NGO - RESET FORM
  const newNgo = () => {
    setForm({ name: '', description: '', phone: '', upi: '', color: '#FF6B35', active: true });
    setEditingId(null);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Loading NGOs...</div>;
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* ✅ HEADER WITH PROMINENT ADD NGO BUTTON */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '40px',
        padding: '24px 32px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb'
      }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#111827', margin: 0 }}>
            Admin Panel - NGOs
          </h1>
          <p style={{ color: '#6b7280', fontSize: '18px', margin: '8px 0 0 0' }}>
            Manage NGOs • {ngos.length} Active
          </p>
        </div>
        
        {/* ✅ BIG PROMINENT ADD NGO BUTTON */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={newNgo}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white', 
              padding: '18px 36px', 
              border: 'none', 
              borderRadius: '16px',
              fontSize: '18px', 
              fontWeight: '700', 
              cursor: 'pointer',
              boxShadow: '0 12px 35px rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 20px 45px rgba(16, 185, 129, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.4)';
            }}
          >
            ➕ Add New NGO
          </button>
          
          <button 
            onClick={logout} 
            style={{
              background: '#ef4444', 
              color: 'white', 
              padding: '16px 28px',
              border: 'none', 
              borderRadius: '12px', 
              fontWeight: '600', 
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)'
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
        {/* NGO LIST */}
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '24px' }}>
            Active NGOs
          </h2>
          {ngos.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '80px 40px', 
              background: '#f8fafc', 
              borderRadius: '16px', 
              border: '2px dashed #d1d5db'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '24px', color: '#10b981' }}>➕</div>
              <h3 style={{ color: '#111827', margin: '0 0 12px 0', fontSize: '24px' }}>
                No NGOs Yet
              </h3>
              <p style={{ color: '#6b7280', fontSize: '18px', margin: 0 }}>
                Click "➕ Add New NGO" above to get started!
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {ngos.map((ngo) => (
                <div key={ngo._id || ngo.id} style={{
                  padding: '24px', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '16px',
                  background: 'white', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px', 
                      background: ngo.color, color: 'white', fontWeight: '700',
                      fontSize: '18px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {ngo.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: '0 0 4px 0' }}>
                        {ngo.name}
                      </h3>
                      <p style={{ color: '#6b7280', margin: 0, fontSize: '15px' }}>
                        {ngo.upi}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={() => editNgo(ngo)}
                      style={{
                        background: '#3b82f6', color: 'white', padding: '8px 16px',
                        border: 'none', borderRadius: '8px', fontSize: '14px', 
                        cursor: 'pointer', fontWeight: '600'
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => deleteNgo(ngo._id || ngo.id)}
                      style={{
                        background: '#ef4444', color: 'white', padding: '8px 16px',
                        border: 'none', borderRadius: '8px', fontSize: '14px', 
                        cursor: 'pointer', fontWeight: '600'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ADD/EDIT FORM */}
        <div style={{
          background: 'white', padding: '32px', borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>
              {editingId ? `✏️ Edit NGO` : '➕ Add New NGO'}
            </h2>
            <button 
              type="button"
              onClick={newNgo}
              style={{
                background: '#f59e0b', color: 'white', padding: '10px 20px',
                border: 'none', borderRadius: '8px', fontSize: '14px', 
                cursor: 'pointer', fontWeight: '600'
              }}
            >
              🆕 New
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input 
              placeholder="NGO Name *" 
              value={form.name} 
              onChange={(e) => setForm({...form, name: e.target.value})}
              style={{ padding: '14px 16px', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '16px' }}
              required 
            />
            <input 
              placeholder="Description" 
              value={form.description} 
              onChange={(e) => setForm({...form, description: e.target.value})}
              style={{ padding: '14px 16px', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '16px' }}
            />
            <input 
              placeholder="Phone Number" 
              value={form.phone} 
              onChange={(e) => setForm({...form, phone: e.target.value})}
              style={{ padding: '14px 16px', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '16px' }}
            />
            <input 
              placeholder="UPI ID (name@bank)" 
              value={form.upi} 
              onChange={(e) => setForm({...form, upi: e.target.value})}
              style={{ padding: '14px 16px', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '16px' }}
              required 
            />
            <label style={{ fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Color:</label>
            <input 
              type="color" 
              value={form.color} 
              onChange={(e) => setForm({...form, color: e.target.value})}
              style={{ padding: '14px 16px', border: '2px solid #e5e7eb', borderRadius: '12px', height: '50px' }}
            />
            <button 
              type="submit" 
              disabled={submitLoading}
              style={{
                background: editingId ? '#3b82f6' : '#10b981',
                color: 'white', padding: '16px', border: 'none', borderRadius: '12px',
                fontSize: '18px', fontWeight: '700', cursor: submitLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {submitLoading ? 'Saving...' : (editingId ? 'Update NGO' : 'Add NGO')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}