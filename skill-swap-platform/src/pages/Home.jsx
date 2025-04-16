import React from 'react';

const Home = () => {
  return (
    <div className="space-y-16">
      <section className="text-center py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-400 mb-6">
          Welcome to SkillSwap
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Exchange skills, learn from others, and grow together
        </p>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-dark-800 p-6 rounded-lg border border-dark-700 hover:border-primary-500 transition-colors">
            <h3 className="text-xl font-semibold text-primary-400 mb-4">
              Share Your Skills
            </h3>
            <p className="text-gray-300">
              Offer your expertise to others in the community
            </p>
          </div>
          <div className="bg-dark-800 p-6 rounded-lg border border-dark-700 hover:border-primary-500 transition-colors">
            <h3 className="text-xl font-semibold text-primary-400 mb-4">
              Learn New Skills
            </h3>
            <p className="text-gray-300">
              Find mentors and learn from experienced professionals
            </p>
          </div>
          <div className="bg-dark-800 p-6 rounded-lg border border-dark-700 hover:border-primary-500 transition-colors">
            <h3 className="text-xl font-semibold text-primary-400 mb-4">
              Connect
            </h3>
            <p className="text-gray-300">
              Build your network and collaborate with others
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 