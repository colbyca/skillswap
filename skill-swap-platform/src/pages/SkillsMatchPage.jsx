import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import ProfileDialog from '../components/ProfileDialog';

const SkillsMatchPage = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError('');

        // Get current user's profile
        const currentUserDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const currentUserData = currentUserDoc.data();
        const currentUserSkillsIHave = currentUserData.skillsIHave || [];
        const currentUserSkillsIWant = currentUserData.skillsIWant || [];

        // Get all other users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const allUsers = usersSnapshot.docs
          .filter(doc => doc.id !== currentUser.uid)
          .map(doc => ({ id: doc.id, ...doc.data() }))
          // Filter out users without valid contact methods
          .filter(user => {
            const contactMethods = user.contactMethods || {};
            return Object.entries(contactMethods).some(([_, value]) => value && value.trim() !== '');
          });

        // Find matches
        const potentialMatches = await Promise.all(allUsers.map(async user => {
          const userSkillsIHave = user.skillsIHave || [];
          const userSkillsIWant = user.skillsIWant || [];

          // Find matching skills in both directions
          const matchingSkillsIHave = currentUserSkillsIHave.filter(skillId =>
            userSkillsIWant.includes(skillId)
          );
          const matchingSkillsIWant = currentUserSkillsIWant.filter(skillId =>
            userSkillsIHave.includes(skillId)
          );

          // Only include users with at least one match in BOTH directions
          if (matchingSkillsIHave.length > 0 && matchingSkillsIWant.length > 0) {
            // Fetch skill details for display
            const skillsIHaveDocs = await Promise.all(
              userSkillsIHave.map(skillId => getDoc(doc(db, 'skills', skillId)))
            );
            const skillsIWantDocs = await Promise.all(
              userSkillsIWant.map(skillId => getDoc(doc(db, 'skills', skillId)))
            );
            const matchingSkillsIHaveDocs = await Promise.all(
              matchingSkillsIHave.map(skillId => getDoc(doc(db, 'skills', skillId)))
            );
            const matchingSkillsIWantDocs = await Promise.all(
              matchingSkillsIWant.map(skillId => getDoc(doc(db, 'skills', skillId)))
            );

            return {
              ...user,
              skillsIHave: skillsIHaveDocs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                tags: doc.data().tags || []
              })),
              skillsIWant: skillsIWantDocs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                tags: doc.data().tags || []
              })),
              matchingSkillsIHave: matchingSkillsIHaveDocs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                tags: doc.data().tags || []
              })),
              matchingSkillsIWant: matchingSkillsIWantDocs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                tags: doc.data().tags || []
              }))
            };
          }
          return null;
        }));

        setMatches(potentialMatches.filter(match => match !== null));
      } catch (error) {
        setError('Failed to fetch matches: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [currentUser]);

  const filteredMatches = matches.filter(match => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();

    // Helper function to check if a skill matches the search term
    const skillMatchesSearch = (skill) => {
      return (
        skill.name.toLowerCase().includes(searchLower) ||
        skill.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    };

    return (
      match.name.toLowerCase().includes(searchLower) ||
      match.matchingSkillsIHave.some(skillMatchesSearch) ||
      match.matchingSkillsIWant.some(skillMatchesSearch)
    );
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-100">Find Skill Matches</h1>
      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
        <input
          type="text"
          placeholder="Search for skills or names..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-4 py-2 rounded-lg bg-dark-800 border border-dark-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>
      <div className="bg-dark-800 p-6 rounded-lg border border-dark-700 min-h-[300px]">
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {loading ? (
          <div className="text-gray-400 text-center">Loading matches...</div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-gray-400 text-center">
            {searchTerm ? 'No matches found for your search' : 'No skill matches found'}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredMatches.map(match => (
              <div
                key={match.id}
                className="bg-dark-700 p-4 rounded-lg cursor-pointer hover:bg-dark-600 transition-colors"
                onClick={() => setSelectedUser(match)}
              >
                <h3 className="text-xl font-semibold text-gray-100 mb-3">{match.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Skills They Want</h4>
                    <div className="flex flex-wrap gap-2">
                      {match.skillsIWant.map(skill => (
                        <span
                          key={skill.id}
                          className={`px-3 py-1 rounded-full text-sm ${match.matchingSkillsIHave.some(s => s.id === skill.id)
                            ? 'bg-primary-600 text-white'
                            : 'bg-dark-600 text-gray-300'
                            }`}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Skills They Have</h4>
                    <div className="flex flex-wrap gap-2">
                      {match.skillsIHave.map(skill => (
                        <span
                          key={skill.id}
                          className={`px-3 py-1 rounded-full text-sm ${match.matchingSkillsIWant.some(s => s.id === skill.id)
                            ? 'bg-primary-600 text-white'
                            : 'bg-dark-600 text-gray-300'
                            }`}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedUser && (
        <ProfileDialog
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default SkillsMatchPage; 