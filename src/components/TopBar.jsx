import React from 'react';
import { User, Bell } from 'lucide-react';
import './TopBar.css';

// Add props here
const TopBar = ({ onProfileClick, user }) => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="brand-name">KarmhaGaon</span>
      </div>
      
      <div className="topbar-right">
        <button className="icon-btn">
          <Bell size={20} color="#5f6368" />
        </button>

        {/* Click triggers the modal */}
        <button className="profile-icon" onClick={onProfileClick}>
          {/* If user logged in, show first letter of email, else show User icon */}
          {user ? (
            <span style={{color: 'white', fontWeight: 'bold'}}>
              {user.email.charAt(0).toUpperCase()}
            </span>
          ) : (
            <User size={20} color="#fff" />
          )}
        </button>
      </div>
    </header>
  );
};

export default TopBar;