import React from 'react';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>Welcome to SkillSwap</h1>
        <p>Exchange skills, learn from others, and grow together</p>
      </section>
      <section className="features">
        <h2>How It Works</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>Share Your Skills</h3>
            <p>Offer your expertise to others in the community</p>
          </div>
          <div className="feature">
            <h3>Learn New Skills</h3>
            <p>Find mentors and learn from experienced professionals</p>
          </div>
          <div className="feature">
            <h3>Connect</h3>
            <p>Build your network and collaborate with others</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 