import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setError('');
      setLoading(true);
      await logout();
      navigate('/');
    } catch (error) {
      setError('Failed to log out: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="profile-info">
        {currentUser ? (
          <>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>Display Name:</strong> {currentUser.displayName || 'Not set'}</p>
            <p><strong>Account Created:</strong> {currentUser.metadata.creationTime}</p>
            <p><strong>Last Sign In:</strong> {currentUser.metadata.lastSignInTime}</p>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="logout-button"
            >
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </>
        ) : (
          <p>Please log in to view your profile</p>
        )}
      </div>
    </div>
  );
};

export default Profile; 