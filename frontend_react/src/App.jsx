import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import NGODashboard from './pages/NGODashboard';
import Donate from './pages/Donate';
import Request from './pages/Request';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const token = localStorage.getItem('helphub_token');

  return (
    <div className="app">
      <Navbar />
      <div className="content container">
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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
