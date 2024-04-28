// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Questions from './components/Questions';
import Sidebar from './components/Sidebar';
import CalendarPage from './components/CalendarPage'; 
import TalkToEliPage from './components/TalkToEliPage';
import './App.css';

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

const App = () => {
  // Function to handle page selection from Sidebar
  const handleMenuSelect = (page) => {
    // Use the `page` argument to navigate to the selected route
    // We'll define how to do this when updating Sidebar.js
  };

  return (
    <div className="app">
      <Sidebar onMenuSelect={handleMenuSelect} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Questions" element={<Questions />} />
        <Route path="/talk-to-eli" element={<TalkToEliPage />} />
        <Route path="/calendar" element={<CalendarPage />} /> {/* Route for the CalendarPage */}
        {/* ... other routes */}
      </Routes>
    </div>
  );
};

export default AppWrapper;
