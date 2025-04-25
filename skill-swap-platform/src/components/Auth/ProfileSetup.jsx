import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const ProfileSetup = () => {
  const { currentUser, setHasCompletedProfile } = useAuth();
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
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [contactMethods, setContactMethods] = useState({
    email: '',
    phone: '',
    discord: '',
    instagram: '',
    twitter: ''
  });
  const [selectedContactTypes, setSelectedContactTypes] = useState([]);

  const contactTypes = [
    { id: 'email', label: 'Email', placeholder: 'your@email.com', validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    { id: 'phone', label: 'Phone Number', placeholder: '+1 (555) 555-5555', validation: /^\+?[\d\s-()]{10,}$/ },
    { id: 'discord', label: 'Discord', placeholder: 'username#1234', validation: /^.{3,32}#[0-9]{4}$/ },
    { id: 'instagram', label: 'Instagram', placeholder: '@username', validation: /^@?[a-zA-Z0-9._]{1,30}$/ },
    { id: 'twitter', label: 'Twitter', placeholder: '@username', validation: /^@?[a-zA-Z0-9_]{1,15}$/ }
  ];

  useEffect(() => {
    // Fetch available skills from Firestore
    const fetchSkills = async () => {
      try {
        const skillsSnapshot = await getDocs(collection(db, 'skills'));
        const skills = skillsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAvailableSkills(skills);

        // Extract all unique tags
        const tags = new Set();
        skills.forEach(skill => {
          skill.tags.forEach(tag => tags.add(tag));
        });
        setAllTags([...tags]);
      } catch (error) {
        setError('Failed to fetch skills: ' + error.message);
      }
    };

    fetchSkills();
  }, []);

  useEffect(() => {
    // Filter skills based on search term and selected tags
    const filtered = availableSkills.filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesTags = selectedTags.length === 0 ||
        selectedTags.every(tag => skill.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
    setFilteredSkills(filtered);
  }, [searchTerm, availableSkills, selectedTags]);

  const handleSkillSelect = (skill, direction) => {
    if (direction === 'left') {
      if (!skillsIHave.some(s => s.id === skill.id)) {
        setSkillsIHave([...skillsIHave, { id: skill.id, name: skill.name }]);
      }
    } else {
      if (!skillsIWant.some(s => s.id === skill.id)) {
        setSkillsIWant([...skillsIWant, { id: skill.id, name: skill.name }]);
      }
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleContactType = (type) => {
    setSelectedContactTypes(prev => {
      if (prev.includes(type)) {
        const newContactMethods = { ...contactMethods };
        delete newContactMethods[type];
        setContactMethods(newContactMethods);
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleContactChange = (type, value) => {
    setContactMethods(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const validateContactMethod = (type, value) => {
    const contactType = contactTypes.find(t => t.id === type);
    if (!contactType) return true;
    return contactType.validation.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    // Check if at least one contact method is provided
    const hasValidContactMethod = Object.entries(contactMethods).some(([type, value]) =>
      selectedContactTypes.includes(type) && value && value.trim() !== ''
    );

    if (!hasValidContactMethod) {
      setError('At least one contact method is required');
      return;
    }

    // Validate all contact methods
    for (const type of selectedContactTypes) {
      if (!validateContactMethod(type, contactMethods[type])) {
        setError(`Invalid ${type} format`);
        return;
      }
    }

    try {
      setLoading(true);
      setError('');

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', currentUser.uid), {
        name,
        bio,
        skillsIHave: skillsIHave.map(skill => skill.id),
        skillsIWant: skillsIWant.map(skill => skill.id),
        contactMethods,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Set profile completion status
      setHasCompletedProfile(true);
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

        <div className="flex gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-100 mb-2">Skills I Have</h3>
            <div className="bg-dark-700 p-4 rounded-lg min-h-[200px] max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-dark-600 scrollbar-track-dark-800">
              {skillsIHave.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-2 hover:bg-dark-600 rounded-lg"
                >
                  <span className="text-gray-100">{skill.name}</span>
                  <button
                    type="button"
                    onClick={() => setSkillsIHave(skillsIHave.filter(s => s.id !== skill.id))}
                    className="text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Search Skills
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type to search skills or tags..."
              className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="mt-4 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-dark-600 scrollbar-track-dark-800">
              {filteredSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-2 hover:bg-dark-700 rounded-lg"
                >
                  <button
                    type="button"
                    onClick={() => handleSkillSelect(skill, 'left')}
                    className="text-blue-400 hover:text-blue-300 text-2xl"
                  >
                    ←
                  </button>
                  <div className="flex-1 px-4">
                    <div className="text-gray-100">{skill.name}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {skill.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs bg-dark-600 text-gray-400 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSkillSelect(skill, 'right')}
                    className="text-blue-400 hover:text-blue-300 text-2xl"
                  >
                    →
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-100 mb-2">Skills I Want</h3>
            <div className="bg-dark-700 p-4 rounded-lg min-h-[200px] max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-dark-600 scrollbar-track-dark-800">
              {skillsIWant.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-2 hover:bg-dark-600 rounded-lg"
                >
                  <span className="text-gray-100">{skill.name}</span>
                  <button
                    type="button"
                    onClick={() => setSkillsIWant(skillsIWant.filter(s => s.id !== skill.id))}
                    className="text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-100 mb-4">Contact Methods</h3>
          <div className="space-y-4">
            {contactTypes.map(type => (
              <div key={type.id} className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  id={type.id}
                  checked={selectedContactTypes.includes(type.id)}
                  onChange={() => toggleContactType(type.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-dark-600 rounded"
                />
                <label htmlFor={type.id} className="text-gray-300">
                  {type.label}
                </label>
                {selectedContactTypes.includes(type.id) && (
                  <input
                    type="text"
                    value={contactMethods[type.id] || ''}
                    onChange={(e) => handleContactChange(type.id, e.target.value)}
                    placeholder={type.placeholder}
                    className={`flex-1 px-4 py-2 bg-dark-700 border ${contactMethods[type.id] && !validateContactMethod(type.id, contactMethods[type.id])
                      ? 'border-red-500'
                      : 'border-dark-600'
                      } rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                )}
              </div>
            ))}
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