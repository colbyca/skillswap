import React from 'react';

const SkillsMatchPage = () => {
  return (
    <div className="skills-match-container">
      <h1>Find Skill Matches</h1>
      <div className="search-section">
        <input
          type="text"
          placeholder="Search for skills..."
          className="search-input"
        />
        <button className="search-button">Search</button>
      </div>
      <div className="matches-grid">
        {/* TODO: Add skill matches display */}
        <p>Skill matches will be displayed here</p>
      </div>
    </div>
  );
};

export default SkillsMatchPage; 