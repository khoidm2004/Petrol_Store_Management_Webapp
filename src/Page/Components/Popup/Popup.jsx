import React, { useEffect } from 'react';
import { AiOutlineClose, AiOutlineBell } from 'react-icons/ai';
import './Popup.css';
import notificationAudio from './../../../assets/audio/notificationAudio.mp3';

const Popup = ({ title, message, onClose }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose(); 
    }, 3000);

    return () => clearTimeout(timeout); 
  }, [onClose]);

  return (
    <div className="popup-row">
      <div className='popup-container'>
        {/* <AiOutlineClose onClick={onClose} className="close-icon" /> */}
        <br></br>
        <div className="popup-content">
          <p>{title}</p>
          <p>{message}</p>
        </div>
        <div className="popup-overlay" onClick={onClose}></div>
        {/* <audio id="ting-ting-audio">
          <source src={notificationAudio} type="audio/mp3" />
        </audio> */}
      </div>
    </div>
  );
};

export default Popup;
