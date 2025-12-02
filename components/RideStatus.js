import React from 'react';
import './RideStatus.css';

const RideStatus = ({ status, onCancel }) => {
  return (
    <div className="ride-status-container glass-panel">
      {status === 'searching' && (
        <div className="status-content">
          <div className="loader-ring">
            <div></div><div></div><div></div><div></div>
          </div>
          <h3>Finding your driver...</h3>
          <p>Connecting you with nearby futuristic rides</p>
        </div>
      )}
      
      {status === 'confirmed' && (
        <div className="status-content success">
          <div className="success-icon">✓</div>
          <h3>Ride Confirmed!</h3>
          <p>Your driver is on the way (2 mins)</p>
          <div className="driver-info">
            <div className="driver-avatar"></div>
            <div>
              <p className="driver-name">Alex T.</p>
              <p className="car-details">Tesla Cybercab • LAG-2077</p>
            </div>
          </div>
        </div>
      )}

      {status === 'arriving' && (
        <div className="status-content">
          <h3>Driver Arriving</h3>
          <p>Please meet at the pickup point</p>
        </div>
      )}

      {status === 'searching' && (
        <button className="cancel-btn" onClick={onCancel}>
          Cancel Request
        </button>
      )}
    </div>
  );
};

export default RideStatus;
