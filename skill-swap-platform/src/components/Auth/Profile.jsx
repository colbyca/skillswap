import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          }
        } catch (error) {
          setError('Failed to fetch profile: ' + error.message);
        }
      }
    };

    fetchUserProfile();
  }, [currentUser]);

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
    <div className="max-w-4xl mx-auto bg-dark-800 p-8 rounded-lg border border-dark-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-100">Profile</h2>
        <Link
          to="/edit-profile"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Edit Profile
        </Link>
      </div>
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="space-y-6">
        {currentUser && userProfile ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-dark-700 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Name</p>
                <p className="text-gray-100">{userProfile.name}</p>
              </div>
              <div className="bg-dark-700 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-gray-100">{currentUser.email}</p>
              </div>
              <div className="bg-dark-700 p-4 rounded-lg md:col-span-2">
                <p className="text-sm text-gray-400">Bio</p>
                <p className="text-gray-100">{userProfile.bio || 'No bio provided'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-dark-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-100 mb-4">Skills I Have</h3>
                <div className="space-y-2">
                  {userProfile.skillsIHave?.length > 0 ? (
                    userProfile.skillsIHave.map((skill) => (
                      <div
                        key={skill}
                        className="bg-dark-600 px-3 py-2 rounded-lg text-gray-100"
                      >
                        {skill}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No skills added yet</p>
                  )}
                </div>
              </div>

              <div className="bg-dark-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-100 mb-4">Skills I Want</h3>
                <div className="space-y-2">
                  {userProfile.skillsIWant?.length > 0 ? (
                    userProfile.skillsIWant.map((skill) => (
                      <div
                        key={skill}
                        className="bg-dark-600 px-3 py-2 rounded-lg text-gray-100"
                      >
                        {skill}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No skills added yet</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-dark-700 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Account Created</p>
                <p className="text-gray-100">
                  {new Date(userProfile.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-dark-700 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Last Updated</p>
                <p className="text-gray-100">
                  {new Date(userProfile.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </>
        ) : (
          <p className="text-gray-400 text-center">Please log in to view your profile</p>
        )}
      </div>
    </div>
  );
};

export default Profile; 