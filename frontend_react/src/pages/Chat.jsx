import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [request, setRequest] = useState(null);
  const scrollRef = useRef();
  const socketRef = useRef();
  const user = JSON.parse(localStorage.getItem('helphub_user') || '{}');

  useEffect(() => {
    const stored = window.localStorage.getItem('helphub_chat_' + id);
    if (stored) setMessages(JSON.parse(stored));
  }, [id]);

  useEffect(() => {
    fetch('/api/requests/' + id, {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('helphub_token') },
    })
      .then((res) => res.json())
      .then((data) => setRequest(data))
      .catch((err) => console.error('Failed to load request for chat', err));
  }, [id]);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL || '');
    socketRef.current.emit('join_room', id);

    socketRef.current.on('receive_message', (msg) => {
      setMessages((prev) => {
        // Prevent duplicate messages if any
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, { ...msg, isMe: false }];
      });
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [id]);

  useEffect(() => {
    window.localStorage.setItem('helphub_chat_' + id, JSON.stringify(messages));
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, id]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    // Check if recipient is available (either creator or assignee)
    const recipientName = request?.completedBy?.name || request?.createdBy?.name || 'User';

    const newMsg = {
      id: Date.now(),
      from: user.name || 'Me',
      text: text.trim(),
      timestamp: new Date().toISOString(),
      isMe: true,
    };
    
    // Add locally immediately
    setMessages((prev) => [...prev, newMsg]);
    
    // Emit to other users in the room
    if (socketRef.current) {
        socketRef.current.emit('send_message', { roomId: id, message: newMsg });
    }
    
    setText('');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Chat Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass"
          style={{ padding: '1.5rem 2rem', borderRadius: '32px 32px 12px 12px', background: 'white', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}
        >
          <button onClick={() => navigate(-1)} style={{ border: 'none', background: '#f1f5f9', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>{request?.help_type || 'Support'} Chat</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              {request?.completedBy ? 'Task Assigned' : 'Waiting for connection...'}
            </p>
          </div>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
        </motion.header>

        {/* Messages Area */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass"
          style={{ flex: 1, background: 'rgba(255,255,255,0.6)', borderRadius: '12px', padding: '2rem', overflowY: 'auto', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {messages.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
              <i className="fas fa-comments fa-4x mb-3"></i>
              <p style={{ fontWeight: 700 }}>Start a conversation to coordinate help.</p>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((m) => (
                <motion.div 
                  key={m.id}
                  initial={{ opacity: 0, scale: 0.9, x: m.isMe ? 20 : -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  style={{ 
                    alignSelf: m.isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: m.isMe ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '4px', padding: '0 8px' }}>
                    {m.from} � {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ 
                    padding: '12px 20px', 
                    borderRadius: m.isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    background: m.isMe ? 'var(--primary)' : 'white',
                    color: m.isMe ? 'white' : 'var(--text-main)',
                    fontWeight: 600,
                    boxShadow: 'var(--shadow-sm)',
                    fontSize: '0.95rem',
                    wordBreak: 'break-word'
                  }}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          <div ref={scrollRef} />
        </motion.div>

        {/* Input Area */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={sendMessage}
          className="glass"
          style={{ padding: '1rem', borderRadius: '12px 12px 32px 32px', background: 'white', display: 'flex', gap: '12px' }}
        >
          <input 
            className="form-control-v2"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            style={{ flex: 1, border: 'none', background: '#f8fafc' }}
          />
          <button type="submit" style={{ width: '50px', height: '50px', borderRadius: '16px', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
            <i className="fas fa-paper-plane"></i>
          </button>
        </motion.form>
      </div>

      <style>{`
        .form-control-v2 { padding: 14px 20px; border-radius: 16px; font-family: inherit; font-weight: 600; font-size: 1rem; }
        .form-control-v2:focus { outline: none; }
      `}</style>
    </div>
  );
}
