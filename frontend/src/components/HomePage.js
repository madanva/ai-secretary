// HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleGetStartedClick = () => {
    navigate('/Questions'); // Navigate to Talk to Hedoria page when clicked
  };

  return (
    <div className="homepage">
      <div className="welcome-text">
        <h1>Introducing the world to <span className="hedoria-gradient">Eli</span></h1>
        <p>Your AI-powered personal secretary.</p>
      </div>
      <button className="get-started-button" onClick={handleGetStartedClick}>
        Get Started
      </button>
    </div>
  );
};

export default HomePage;
