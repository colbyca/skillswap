import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, logout, hasCompletedProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const renderAuthLinks = () => {
    if (!currentUser) {
      return (
        <>
          <Link to="/login" className="text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
            Login
          </Link>
          <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Register
          </Link>
        </>
      );
    }

    if (!hasCompletedProfile) {
      return (
        <Link to="/profile-setup" className="text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
          Complete Profile
        </Link>
      );
    }

    return (
      <>
        <Link to="/dashboard" className="text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
          Dashboard
        </Link>
        <Link to="/skills-match" className="text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
          Skills Match
        </Link>
        <Link to="/profile" className="text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Logout
        </button>
      </>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-800 border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-primary-400 font-bold text-xl hover:text-primary-300 transition-colors">
              SkillSwap
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Home
            </Link>
            {renderAuthLinks()}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 