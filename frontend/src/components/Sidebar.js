// Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEvent, MdCode, MdDashboard, MdMessage, MdSettings, MdAccountCircle } from 'react-icons/md';
import './Sidebar.css';
import logo from '../assets/eli-logo.png';

const Sidebar = () => {
  const navigate = useNavigate();

  const onMenuSelect = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar">
      <img src={logo} alt="Eli Logo" className="logo" onClick={() => onMenuSelect('/')} />
      <MdMessage className="icon" onClick={() => onMenuSelect('/Questions')} />
      <MdDashboard className="icon" onClick={() => onMenuSelect('/talk-to-eli')} />
      <MdEvent className="icon" onClick={() => onMenuSelect('/calendar')} />
      <div className="separator"></div>
      <MdAccountCircle className="icon" onClick={() => onMenuSelect('/profile')} />
      <MdSettings className="icon" onClick={() => onMenuSelect('/settings')} />
    </div>
  );
};

export default Sidebar;
