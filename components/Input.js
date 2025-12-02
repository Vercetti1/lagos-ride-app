import React from 'react';
import './Input.css';

const Input = ({ label, icon, type = 'text', options, ...props }) => {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <div className="input-container">
        {icon && <span className="input-icon">{icon}</span>}
        {options ? (
          <select className="input-field" {...props}>
            <option value="">{props.placeholder || 'Select location'}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input className="input-field" type={type} {...props} />
        )}
      </div>
    </div>
  );
};

export default Input;
