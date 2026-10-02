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


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
