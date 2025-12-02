"use client";

import React, { useEffect, useState } from 'react';
import { IoCheckmarkCircle, IoCloseCircle, IoInformationCircle, IoWarning, IoClose } from 'react-icons/io5';
import './Toast.css';

const Toast = ({ message, type = 'info', onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  const icons = {
    success: <IoCheckmarkCircle size={24} />,
    error: <IoCloseCircle size={24} />,
    warning: <IoWarning size={24} />,
    info: <IoInformationCircle size={24} />,
  };

  return (
    <div className={`toast toast-${type} ${isVisible ? 'toast-visible' : ''}`}>
      <div className="toast-icon">{icons[type]}</div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={handleClose}>
        <IoClose size={20} />
      </button>
    </div>
  );
};

export default Toast;
