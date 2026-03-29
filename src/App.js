import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RequestHelp from './pages/RequestHelp';
import Dashboard from './pages/Dashboard';

// ✅ NEW PAGES
import Donate from './pages/Donate';
import AnimalRescue from './pages/AnimalRescue';
import HelpList from './pages/HelpList';
import NotFound from './pages/NotFound';
import Status from './pages/Status';
import Profile from './pages/Profile'
import Home from '../src/pages/Home';

// ✅ ADMIN PAGES
import AdminLogin from './pages/AdminLogin';
import AdminNGOs from './pages/AdminNGOs';

// ✅ PROTECTED ROUTE COMPONENT
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router basename={process.env.NODE_ENV === 'production' ? '/helphub' : '/'}>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <main className="container">
            <Routes>
              {/* ✅ PUBLIC ROUTES (No login required) */}
              <Route path="/" element={<Home />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/animal-rescue" element={<AnimalRescue />} />
              <Route path="/request" element={<HelpList />} />
              <Route path="/help-list" element={<HelpList />} />
              <Route path="/status" element={<Status />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* ✅ AUTH ROUTES */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin-login" element={<AdminLogin />} />

              {/* ✅ PROTECTED USER ROUTES (Registered users only) */}
              <Route 
                path="/request-help" 
                element={
                  <ProtectedRoute>
                    <RequestHelp />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />

              {/* ✅ ADMIN ONLY ROUTES */}
              <Route 
                path="/admin/ngos" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminNGOs />
                  </ProtectedRoute>
                } 
              />

              {/* ✅ REDIRECTS */}
              <Route path="/admin" element={<Navigate to="/admin/ngos" replace />} />
              
              {/* ✅ 404 CATCH-ALL */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;