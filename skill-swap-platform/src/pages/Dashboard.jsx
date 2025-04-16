import React from 'react';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-100">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <section className="bg-dark-800 p-6 rounded-lg border border-dark-700">
          <h2 className="text-xl font-semibold text-primary-400 mb-4">My Skills</h2>
          <div className="min-h-[200px] bg-dark-700 rounded p-4">
            {/* TODO: Add skills list component */}
          </div>
        </section>
        <section className="bg-dark-800 p-6 rounded-lg border border-dark-700">
          <h2 className="text-xl font-semibold text-primary-400 mb-4">Skill Requests</h2>
          <div className="min-h-[200px] bg-dark-700 rounded p-4">
            {/* TODO: Add skill requests component */}
          </div>
        </section>
        <section className="bg-dark-800 p-6 rounded-lg border border-dark-700">
          <h2 className="text-xl font-semibold text-primary-400 mb-4">Learning Progress</h2>
          <div className="min-h-[200px] bg-dark-700 rounded p-4">
            {/* TODO: Add learning progress component */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard; 