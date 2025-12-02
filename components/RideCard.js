import React from 'react';
import './RideCard.css';

const RideCard = ({ title, price, time, image, selected, onClick }) => {
  return (
    <div 
      className={`ride-card glass-panel ${selected ? 'selected' : ''}`} 
      onClick={onClick}
    >
      <div className="ride-info">
        <h3 className="ride-title">{title}</h3>
        <p className="ride-time">{time}</p>
      </div>
      <div className="ride-price">
        {price}
      </div>
    </div>
  );
};

export default RideCard;
