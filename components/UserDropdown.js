"use client";

import React, { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import './UserDropdown.css';

const UserDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="user-dropdown" ref={dropdownRef}>
      <button 
        className="user-avatar-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title={user.name}
      >
        {user.image ? (
          <img src={user.image} alt={user.name} className="avatar-img" />
        ) : (
          <div className="avatar-placeholder">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="dropdown-menu glass-panel">
          <div className="dropdown-header">
            <div className="dropdown-avatar">
              {user.image ? (
                <img src={user.image} alt={user.name} />
              ) : (
                <div className="avatar-placeholder-large">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="dropdown-user-info">
              <div className="dropdown-name">{user.name}</div>
              <div className="dropdown-email">{user.email}</div>
            </div>
          </div>
          
          <div className="dropdown-divider"></div>
          
          <button 
            className="dropdown-item logout-btn"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <span>🚪</span>
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
