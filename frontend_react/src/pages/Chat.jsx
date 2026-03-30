import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [request, setRequest] = useState(null);
  const user = JSON.parse(localStorage.getItem('helphub_user') || '{}');

  useEffect(() => {
    const stored = window.localStorage.getItem(`helphub_chat_${id}`);
    if (stored) setMessages(JSON.parse(stored));
  }, [id]);

  useEffect(() => {
    fetch(`/api/requests/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('helphub_token')}` },
    })
      .then((res) => res.json())
      .then((data) => setRequest(data))
      .catch((err) => console.error('Failed to load request for chat', err));
  }, [id]);

  useEffect(() => {
    window.localStorage.setItem(`helphub_chat_${id}`, JSON.stringify(messages));
  }, [id, messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const newMsg = {
      id: Date.now(),
      from: user.name || 'Me',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setText('');
  };

  return (
    <div className="page form-page">
      <motion.div
        className="card-box"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ marginBottom: '12px' }}>
          &larr; Back to Dashboard
        </button>
        <h2>
          Chat: {request?.help_type || 'Help'} request
          <small style={{ display: 'block', fontSize: '14px', marginTop: '4px', color: '#6b7280' }}>
            {request?.completedBy ? `with ${request.completedBy.name || request.completedBy.email}` : 'No helper assigned yet'}
          </small>
        </h2>
        <div className="chat-box" style={{ marginTop: '12px', maxHeight: '360px', overflowY: 'auto', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #dbeafe' }}>
          {messages.length === 0 && <div style={{ color: '#6b7280' }}>No messages yet. Say hello!</div>}
          {messages.map((m) => (
            <div key={m.id} style={{ marginBottom: '10px' }}>
              <strong>{m.from}</strong> <small style={{ color: '#6b7280' }}>{new Date(m.timestamp).toLocaleTimeString()}</small>
              <div style={{ marginTop: '4px', background: '#eff6ff', borderRadius: '8px', padding: '8px' }}>{m.text}</div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="form-control"
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn primary" style={{ width: '150px' }}>
            Send
          </button>
        </form>
      </motion.div>
    </div>
  );
}
