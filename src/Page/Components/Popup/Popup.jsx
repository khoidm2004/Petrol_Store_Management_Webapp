import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import './Popup.css';

const Popup = ({ title, message, onClose }) => {
  return (
    <div className="popup-container">
      <div className="popup-content">
        <AiOutlineClose onClick={onClose} className="close-icon" />
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
      <div className="popup-overlay" onClick={onClose}></div>
    </div>
  );
};

export default Popup;
