import React, { useState } from 'react';

const SkillForm = () => {
  const [skillName, setSkillName] = useState('');
  const [skillDescription, setSkillDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement skill submission logic
  };

  return (
    <div className="skill-form-container">
      <h2>Add New Skill</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="skillName">Skill Name:</label>
          <input
            type="text"
            id="skillName"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="skillDescription">Description:</label>
          <textarea
            id="skillDescription"
            value={skillDescription}
            onChange={(e) => setSkillDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Skill</button>
      </form>
    </div>
  );
};

export default SkillForm; 