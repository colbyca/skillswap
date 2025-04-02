import React from 'react';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="dashboard-grid">
        <section className="my-skills">
          <h2>My Skills</h2>
          {/* TODO: Add skills list component */}
        </section>
        <section className="skill-requests">
          <h2>Skill Requests</h2>
          {/* TODO: Add skill requests component */}
        </section>
        <section className="learning-progress">
          <h2>Learning Progress</h2>
          {/* TODO: Add learning progress component */}
        </section>
      </div>
    </div>
  );
};

export default Dashboard; 