import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark-800 border-t border-dark-700 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} SkillSwap. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="/about" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              About
            </a>
            <a href="/contact" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Contact
            </a>
            <a href="/privacy" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 