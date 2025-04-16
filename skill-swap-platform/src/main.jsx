import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { initializeSkills } from './firebase/initSkills';

// Initialize skills collection
initializeSkills();

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);
