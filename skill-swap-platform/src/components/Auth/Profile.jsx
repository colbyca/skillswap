import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FaEnvelope, FaPhone, FaDiscord, FaInstagram, FaTwitter } from 'react-icons/fa';

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
            const userData = userDoc.data();

            // Fetch skill details for skillsIHave and skillsIWant
            const skillsIHaveDocs = await Promise.all(
              (userData.skillsIHave || []).map(skillId => getDoc(doc(db, 'skills', skillId)))
            );
            const skillsIWantDocs = await Promise.all(
              (userData.skillsIWant || []).map(skillId => getDoc(doc(db, 'skills', skillId)))
            );

            setUserProfile({
              ...userData,
              skillsIHave: skillsIHaveDocs.map(doc => ({ id: doc.id, name: doc.data().name })),
              skillsIWant: skillsIWantDocs.map(doc => ({ id: doc.id, name: doc.data().name }))
            });
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

  const getContactIcon = (type) => {
    switch (type) {
      case 'email':
        return <FaEnvelope className="text-blue-400" />;
      case 'phone':
        return <FaPhone className="text-green-400" />;
      case 'discord':
        return <FaDiscord className="text-indigo-400" />;
      case 'instagram':
        return <FaInstagram className="text-pink-400" />;
      case 'twitter':
        return <FaTwitter className="text-blue-400" />;
      default:
        return null;
    }
  };

  const getContactLink = (type, value) => {
    switch (type) {
      case 'email':
        return `mailto:${value}`;
      case 'phone':
        return `tel:${value.replace(/[^0-9+]/g, '')}`;
      case 'discord':
        return `https://discord.com/users/${value}`;
      case 'instagram':
        return `https://instagram.com/${value.replace('@', '')}`;
      case 'twitter':
        return `https://twitter.com/${value.replace('@', '')}`;
      default:
        return '#';
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
                        key={skill.id}
                        className="bg-dark-600 px-3 py-2 rounded-lg text-gray-100"
                      >
                        {skill.name}
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
                        key={skill.id}
                        className="bg-dark-600 px-3 py-2 rounded-lg text-gray-100"
                      >
                        {skill.name}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No skills added yet</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-dark-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-100 mb-4">Contact Methods</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userProfile.contactMethods && Object.entries(userProfile.contactMethods).filter(([_, value]) => value && value.trim() !== '').length > 0 ? (
                  Object.entries(userProfile.contactMethods)
                    .filter(([_, value]) => value && value.trim() !== '')
                    .map(([type, value]) => (
                      <a
                        key={type}
                        href={getContactLink(type, value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-dark-600 p-3 rounded-lg hover:bg-dark-500 transition-colors flex items-center space-x-3"
                      >
                        <div className="text-xl">
                          {getContactIcon(type)}
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 capitalize">{type}</p>
                          <p className="text-gray-100">{value}</p>
                        </div>
                      </a>
                    ))
                ) : (
                  <p className="text-gray-400 md:col-span-2">No contact methods added yet</p>
                )}
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