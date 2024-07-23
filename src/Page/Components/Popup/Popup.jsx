import { useEffect } from "react";
import "./Popup.css";
const Popup = ({ title, message, status, onClose }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, 2000);

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
      </div>
    </div>
  );
};

export default Popup;
