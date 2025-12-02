"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { IoPerson, IoMail, IoCall, IoLocation, IoSave, IoArrowBack } from 'react-icons/io5';
import Wallet from '../../components/Wallet';
import Button from '../../components/Button';
import { useToast } from '../../hooks/useToast';
import './profile.css';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [walletBalance, setWalletBalance] = useState(5000); // Mock balance
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'credit', description: 'Wallet Funded', amount: 5000, date: new Date().toISOString() },
  ]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (session?.user) {
      setProfile({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: '',
        address: '',
      });
    }
  }, [session, status, router]);

  const handleSave = () => {
    // In a real app, save to backend
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleFundSuccess = (amount, response) => {
    const newBalance = walletBalance + amount;
    setWalletBalance(newBalance);
    
    const newTransaction = {
      id: Date.now(),
      type: 'credit',
      description: 'Wallet Funded',
      amount: amount,
      date: new Date().toISOString(),
    };
    
    setTransactions([newTransaction, ...transactions]);
    toast.success(`Wallet funded with ₦${amount.toLocaleString()}!`);
  };

  if (status === 'loading') {
    return <div className="loading-container">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <Button variant="ghost" onClick={() => router.push('/')}>
            <IoArrowBack size={20} /> Back to Home
          </Button>
          <h1>My Profile</h1>
        </div>

        <div className="profile-content">
          <div className="profile-section glass-panel">
            <div className="section-header">
              <h2>Personal Information</h2>
              {!isEditing && (
                <Button variant="secondary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>

            <div className="profile-avatar">
              {session.user.image ? (
                <img src={session.user.image} alt={session.user.name} />
              ) : (
                <div className="avatar-placeholder">
                  <IoPerson size={48} />
                </div>
              )}
            </div>

            <div className="profile-fields">
              <div className="field-group">
                <label><IoPerson size={18} /> Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                  className="profile-input"
                />
              </div>

              <div className="field-group">
                <label><IoMail size={18} /> Email</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="profile-input"
                />
              </div>

              <div className="field-group">
                <label><IoCall size={18} /> Phone Number</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                  className="profile-input"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="field-group">
                <label><IoLocation size={18} /> Address</label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  disabled={!isEditing}
                  className="profile-input"
                  placeholder="Enter address"
                />
              </div>
            </div>

            {isEditing && (
              <div className="profile-actions">
                <Button variant="ghost" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  <IoSave size={18} /> Save Changes
                </Button>
              </div>
            )}
          </div>

          <div className="wallet-section">
            <Wallet
              user={session.user}
              balance={walletBalance}
              transactions={transactions}
              onFundSuccess={handleFundSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
