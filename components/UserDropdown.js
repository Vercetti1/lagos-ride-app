"use client";

import React, { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { HiArrowRightOnRectangle } from 'react-icons/hi2';
import { IoPerson, IoTime, IoWallet } from 'react-icons/io5';
import './UserDropdown.css';

const UserDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  
  // Mock wallet balance - in real app, fetch from backend
  const walletBalance = 5000;

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
          
          <div className="wallet-balance-item">
            <IoWallet size={18} />
            <span>Wallet Balance</span>
            <span className="balance-amount">₦{walletBalance.toLocaleString()}</span>
          </div>
          
          <div className="dropdown-divider"></div>
          
          <button 
            className="dropdown-item"
            onClick={() => {
              setIsOpen(false);
              router.push('/profile');
            }}
          >
            <IoPerson size={18} />
            My Profile
          </button>
          
          <button 
            className="dropdown-item"
            onClick={() => {
              setIsOpen(false);
              router.push('/history');
            }}
          >
            <IoTime size={18} />
            Ride History
          </button>
          
          <div className="dropdown-divider"></div>
          
          <button 
            className="dropdown-item logout-btn"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <HiArrowRightOnRectangle size={18} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
