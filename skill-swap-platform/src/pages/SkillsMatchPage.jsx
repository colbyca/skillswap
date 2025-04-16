import React from 'react';

const SkillsMatchPage = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-100">Find Skill Matches</h1>
      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
        <input
          type="text"
          placeholder="Search for skills..."
          className="flex-grow px-4 py-2 rounded-lg bg-dark-800 border border-dark-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
        <button className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
          Search
        </button>
      </div>
      <div className="bg-dark-800 p-6 rounded-lg border border-dark-700 min-h-[300px]">
        <div className="text-gray-400">
          {/* TODO: Add skill matches display */}
          <p>Skill matches will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default SkillsMatchPage; 