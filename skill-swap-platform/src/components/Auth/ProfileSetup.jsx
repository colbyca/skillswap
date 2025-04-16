import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const ProfileSetup = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [availableSkills, setAvailableSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [skillsIHave, setSkillsIHave] = useState([]);
  const [skillsIWant, setSkillsIWant] = useState([]);

  useEffect(() => {
    // Fetch available skills from Firestore
    const fetchSkills = async () => {
      try {
        const skillsSnapshot = await getDocs(collection(db, 'skills'));
        const skills = skillsSnapshot.docs.map(doc => doc.data().name);
        setAvailableSkills(skills);
        setFilteredSkills(skills);
      } catch (error) {
        setError('Failed to fetch skills: ' + error.message);
      }
    };

    fetchSkills();
  }, []);

  useEffect(() => {
    // Filter skills based on search term
    const filtered = availableSkills.filter(skill =>
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSkills(filtered);
  }, [searchTerm, availableSkills]);

  const handleSkillSelect = (skill, direction) => {
    if (direction === 'left') {
      if (!skillsIHave.includes(skill)) {
        setSkillsIHave([...skillsIHave, skill]);
      }
    } else {
      if (!skillsIWant.includes(skill)) {
        setSkillsIWant([...skillsIWant, skill]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', currentUser.uid), {
        name,
        bio,
        skillsIHave,
        skillsIWant,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      navigate('/dashboard');
    } catch (error) {
      setError('Failed to create profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-dark-800 p-8 rounded-lg border border-dark-700">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Complete Your Profile</h2>
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Search Skills
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type to search skills..."
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-2 max-h-40 overflow-y-auto">
            {filteredSkills.map((skill) => (
              <div
                key={skill}
                className="flex items-center justify-between p-2 hover:bg-dark-700 rounded-lg"
              >
                <button
                  type="button"
                  onClick={() => handleSkillSelect(skill, 'left')}
                  className="text-blue-400 hover:text-blue-300"
                >
                  ←
                </button>
                <span className="text-gray-100">{skill}</span>
                <button
                  type="button"
                  onClick={() => handleSkillSelect(skill, 'right')}
                  className="text-blue-400 hover:text-blue-300"
                >
                  →
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium text-gray-100 mb-2">Skills I Have</h3>
            <div className="bg-dark-700 p-4 rounded-lg min-h-[200px]">
              {skillsIHave.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center justify-between p-2 hover:bg-dark-600 rounded-lg"
                >
                  <span className="text-gray-100">{skill}</span>
                  <button
                    type="button"
                    onClick={() => setSkillsIHave(skillsIHave.filter(s => s !== skill))}
                    className="text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-100 mb-2">Skills I Want</h3>
            <div className="bg-dark-700 p-4 rounded-lg min-h-[200px]">
              {skillsIWant.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center justify-between p-2 hover:bg-dark-600 rounded-lg"
                >
                  <span className="text-gray-100">{skill}</span>
                  <button
                    type="button"
                    onClick={() => setSkillsIWant(skillsIWant.filter(s => s !== skill))}
                    className="text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Complete Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup; 