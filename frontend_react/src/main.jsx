import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';
import { clearStoredAuth } from './utils/storage';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || '';

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    if (error.response?.status === 401 && !requestUrl.includes('/api/auth/')) {
      clearStoredAuth();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login?session=expired');
      }
    }
    return Promise.reject(error);
  }
);

class AppErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem', background: '#f8fafc', color: '#1e293b', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <section style={{ maxWidth: '440px', padding: '2.5rem', borderRadius: '24px', background: 'white', boxShadow: '0 16px 40px rgba(15, 23, 42, 0.12)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚑</div>
          <h1 style={{ margin: '0 0 0.75rem' }}>HelpHub needs a refresh</h1>
          <p style={{ color: '#64748b', lineHeight: 1.6 }}>The page encountered a temporary browser error. Reload to continue.</p>
          <button type="button" onClick={() => window.location.reload()} style={{ border: 0, borderRadius: '10px', padding: '12px 22px', background: '#2563eb', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Reload HelpHub</button>
        </section>
      </main>
    );
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
