"use client";

import React, { useState } from 'react';
import { IoWallet, IoAdd, IoCard, IoTime } from 'react-icons/io5';
import { format } from 'date-fns';
import PaymentModal from './PaymentModal';
import Button from './Button';
import './Wallet.css';

const Wallet = ({ user, balance = 0, transactions = [], onFundSuccess }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [fundAmount, setFundAmount] = useState('');

  const quickAmounts = [1000, 2000, 5000, 10000];

  const handleFundWallet = () => {
    const amount = parseInt(fundAmount);
    if (!amount || amount < 100) {
      alert('Please enter a valid amount (minimum ₦100)');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (response) => {
    if (onFundSuccess) {
      onFundSuccess(parseInt(fundAmount), response);
    }
    setFundAmount('');
  };

  return (
    <div className="wallet-container">
      <div className="wallet-balance glass-panel">
        <div className="balance-header">
          <div className="balance-icon">
            <IoWallet size={32} />
          </div>
          <div className="balance-info">
            <span className="balance-label">Wallet Balance</span>
            <h2 className="balance-amount">₦{balance.toLocaleString()}</h2>
          </div>
        </div>

        <div className="fund-wallet-section">
          <div className="amount-input-group">
            <input
              type="number"
              className="amount-input"
              placeholder="Enter amount"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              min="100"
            />
            <Button variant="primary" onClick={handleFundWallet}>
              <IoAdd size={20} /> Fund Wallet
            </Button>
          </div>

          <div className="quick-amounts">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                className="quick-amount-btn"
                onClick={() => setFundAmount(amount.toString())}
              >
                ₦{amount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {transactions.length > 0 && (
        <div className="transactions-section">
          <h3 className="section-title">Recent Transactions</h3>
          <div className="transactions-list">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="transaction-item glass-panel">
                <div className="transaction-icon">
                  {transaction.type === 'credit' ? (
                    <IoAdd size={20} style={{ color: '#10b981' }} />
                  ) : (
                    <IoCard size={20} style={{ color: '#ef4444' }} />
                  )}
                </div>
                <div className="transaction-details">
                  <span className="transaction-description">{transaction.description}</span>
                  <span className="transaction-date">
                    <IoTime size={14} /> {format(new Date(transaction.date), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>
                <div className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={parseInt(fundAmount) || 0}
        email={user?.email || ''}
        onSuccess={handlePaymentSuccess}
        title="Fund Wallet"
        description="Add money to your wallet for seamless ride payments"
      />
    </div>
  );
};

export default Wallet;
