"use client";

import React, { useState } from 'react';
import { IoClose, IoCard } from 'react-icons/io5';
import { usePaystackScript, initializePayment } from '../hooks/usePaystack';
import Button from './Button';
import './PaymentModal.css';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  amount, 
  email, 
  onSuccess, 
  title = "Fund Wallet",
  description 
}) => {
  usePaystackScript();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePayment = () => {
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    
    if (!publicKey) {
      alert('Payment configuration error. Please contact support.');
      return;
    }

    setIsProcessing(true);

    initializePayment({
      email,
      amount: amount * 100, // Convert to kobo
      publicKey,
      onSuccess: (response) => {
        setIsProcessing(false);
        onSuccess(response);
        onClose();
      },
      onClose: () => {
        setIsProcessing(false);
      },
    });
  };

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <IoClose size={24} />
        </button>

        <div className="modal-header">
          <div className="modal-icon">
            <IoCard size={40} />
          </div>
          <h2>{title}</h2>
          {description && <p className="modal-description">{description}</p>}
        </div>

        <div className="modal-body">
          <div className="payment-amount">
            <span className="amount-label">Amount</span>
            <span className="amount-value">₦{amount.toLocaleString()}</span>
          </div>

          <div className="payment-info">
            <p>You will be redirected to Paystack to complete your payment securely.</p>
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="ghost" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay ₦${amount.toLocaleString()}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
