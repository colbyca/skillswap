import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

const ProfileDialog = ({ user, onClose }) => {
  const { currentUser } = useAuth();
  const [selectedSkillsOffered, setSelectedSkillsOffered] = useState([]);
  const [selectedSkillsWanted, setSelectedSkillsWanted] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSkillSelect = (skill, type) => {
    if (type === 'offered') {
      setSelectedSkillsOffered(prev =>
        prev.includes(skill.id)
          ? prev.filter(id => id !== skill.id)
          : [...prev, skill.id]
      );
    } else {
      setSelectedSkillsWanted(prev =>
        prev.includes(skill.id)
          ? prev.filter(id => id !== skill.id)
          : [...prev, skill.id]
      );
    }
  };

  const handleConnect = async () => {
    if (selectedSkillsOffered.length === 0 || selectedSkillsWanted.length === 0) {
      setError('Please select at least one skill from each category');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await addDoc(collection(db, 'connections'), {
        senderId: currentUser.uid,
        recipientId: user.id,
        skillsOffered: selectedSkillsOffered,
        skillsWanted: selectedSkillsWanted,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      onClose();
    } catch (error) {
      setError('Failed to send connection request: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

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
            <h2 className="text-2xl font-bold text-gray-100">{user.name}</h2>
            <p className="text-gray-300 mt-2">{user.bio || 'No bio provided'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-dark-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-100 mb-4">Skills They Want</h3>
              <div className="space-y-2">
                {user.skillsIWant?.map((skill) => (
                  <div
                    key={skill.id}
                    className={`px-3 py-2 rounded-lg text-sm cursor-pointer ${selectedSkillsOffered.includes(skill.id)
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-600 text-gray-300 hover:bg-dark-500'
                      }`}
                    onClick={() => handleSkillSelect(skill, 'offered')}
                  >
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-dark-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-100 mb-4">Skills They Have</h3>
              <div className="space-y-2">
                {user.skillsIHave?.map((skill) => (
                  <div
                    key={skill.id}
                    className={`px-3 py-2 rounded-lg text-sm cursor-pointer ${selectedSkillsWanted.includes(skill.id)
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-600 text-gray-300 hover:bg-dark-500'
                      }`}
                    onClick={() => handleSkillSelect(skill, 'wanted')}
                  >
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleConnect}
              disabled={loading || (selectedSkillsOffered.length === 0 || selectedSkillsWanted.length === 0)}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Connect'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDialog; 