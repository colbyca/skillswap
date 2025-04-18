import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaPhone, FaDiscord, FaInstagram, FaTwitter } from 'react-icons/fa';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

const ConnectionDialog = ({ connection, onClose }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsWanted, setSkillsWanted] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        // Fetch offered skills
        const offeredSkills = await Promise.all(
          connection.skillsOffered.map(async (skillId) => {
            const skillDoc = await getDoc(doc(db, 'skills', skillId));
            return skillDoc.exists() ? { id: skillDoc.id, ...skillDoc.data() } : null;
          })
        );
        setSkillsOffered(offeredSkills.filter(skill => skill !== null));

        // Fetch wanted skills
        const wantedSkills = await Promise.all(
          connection.skillsWanted.map(async (skillId) => {
            const skillDoc = await getDoc(doc(db, 'skills', skillId));
            return skillDoc.exists() ? { id: skillDoc.id, ...skillDoc.data() } : null;
          })
        );
        setSkillsWanted(wantedSkills.filter(skill => skill !== null));
      } catch (error) {
        console.error('Error fetching skills:', error);
        setError('Failed to load skills');
      }
    };

    if (connection) {
      fetchSkills();
    }
  }, [connection]);

  const handleRemove = async () => {
    try {
      setLoading(true);
      setError('');

      await deleteDoc(doc(db, 'connections', connection.id));
      onClose();
    } catch (error) {
      setError('Failed to remove connection: ' + error.message);
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

  if (!connection || !connection.recipient) {
    return null;
  }

  const otherUser = connection.recipient;

  // Debug log to check the data structure
  console.log('Connection data:', connection);
  console.log('Other user data:', otherUser);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-dark-800 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-xl"
        >
          ×
        </button>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-100">{otherUser.name}</h2>
            <p className="text-gray-300 mt-2">{otherUser.bio || 'No bio provided'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-dark-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-100 mb-4">Skills They Have</h3>
              <div className="flex flex-wrap gap-2">
                {skillsOffered.map((skill, index) => (
                  <span
                    key={`have-${skill.id || index}`}
                    className="px-3 py-1 rounded-full text-sm bg-primary-600 text-white"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-dark-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-100 mb-4">Skills They Want</h3>
              <div className="flex flex-wrap gap-2">
                {skillsWanted.map((skill, index) => (
                  <span
                    key={`want-${skill.id || index}`}
                    className="px-3 py-1 rounded-full text-sm bg-dark-600 text-gray-300"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {otherUser.contactMethods && Object.entries(otherUser.contactMethods).filter(([_, value]) => value && value.trim() !== '').length > 0 && (
            <div className="bg-dark-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-100 mb-4">Contact Methods</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(otherUser.contactMethods)
                  .filter(([_, value]) => value && value.trim() !== '')
                  .map(([type, value], index) => (
                    <a
                      key={`contact-${type}-${value}-${index}`}
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
                  ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleRemove}
              disabled={loading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Remove Connection'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionDialog; 