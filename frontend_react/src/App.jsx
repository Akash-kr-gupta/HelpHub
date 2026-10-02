import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import NGODashboard from './pages/NGODashboard';
import Donate from './pages/Donate';
import Request from './pages/Request';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import VolunteerDashboard from './pages/VolunteerDashboard';
import { getStoredToken, getStoredUser } from './utils/storage';

function App() {
  const location = useLocation();
  const [auth, setAuth] = useState(() => ({ token: getStoredToken(), user: getStoredUser() }));

  useEffect(() => {
    const refreshAuth = () => setAuth({ token: getStoredToken(), user: getStoredUser() });
    window.addEventListener('helphub-auth-changed', refreshAuth);
    window.addEventListener('storage', refreshAuth);
    return () => {
      window.removeEventListener('helphub-auth-changed', refreshAuth);
      window.removeEventListener('storage', refreshAuth);
    };
  }, []);

  const { token, user } = auth;
  
  // Routes that should NOT be wrapped in a standard container (usually full-width/dashboard layouts)
  const isDashboardRoute = ['/dashboard', '/ngo-dashboard', '/volunteer-dashboard', '/login', '/signup', '/profile', '/analytics', '/request', '/donate', '/'].includes(location.pathname) || location.pathname.startsWith('/chat');

  return (
    <div className="app">
      <Navbar token={token} user={user} />
      <div className={isDashboardRoute ? "content-full" : "content container"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={token ? <Dashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/ngo-dashboard"
            element={token ? <NGODashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/volunteer-dashboard"
            element={token ? <VolunteerDashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/donate"
            element={token ? <Donate /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/request"
            element={token ? <Request /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/chat/:id"
            element={token ? <Chat /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={token ? <Profile /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/analytics"
            element={token ? <Analytics /> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
