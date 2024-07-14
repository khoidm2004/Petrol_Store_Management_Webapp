import React, { useEffect } from "react";
import "./Popup.css";
import notificationAudio from "../../../assets/audio/notificationAudio.mp3";

const Popup = ({ title, message, status, onClose }) => {
  useEffect(() => {
    // const audio = document.getElementById("ting-ting-audio");
    // if (audio) {
    //   audio.play().catch(error => console.error("Audio playback failed:", error));
    // }

    const timeout = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className="popup-row">
      <div className="popup-container">
        <br />
        <div className={`popup-content ${status}`}>
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
