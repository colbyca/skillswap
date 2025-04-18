import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SkillsMatchPage from './pages/SkillsMatchPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Auth/Profile';
import ProfileSetup from './components/Auth/ProfileSetup';
import EditProfile from './components/Auth/EditProfile';
import PrivateRoute from './components/Auth/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-dark-900 text-gray-100">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 pt-24 px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/skills-match" element={
                <PrivateRoute>
                  <SkillsMatchPage />
                </PrivateRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile-setup" element={
                <PrivateRoute>
                  <ProfileSetup />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/edit-profile" element={
                <PrivateRoute>
                  <EditProfile />
                </PrivateRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
