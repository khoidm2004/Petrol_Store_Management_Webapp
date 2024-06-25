// LoginForm.js
import React, { useState } from 'react';
import './LoginForm.css';
import { AiOutlineClose } from "react-icons/ai";
import coverimages from "../../../assets/images/coverimages.png";
import user from "../../../assets/images/user.png";
import useLogin from '../../../hooks/useLogin.js';
import useReclaimPassword from '../../../hooks/useReclaimPassword';
import Popup from '../Popup/Popup';

const LoginForm = ({ setLoggedIn }) => {
  const { login, loading } = useLogin();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState('');
  const [popup, setPopup] = useState({ show: false, title: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    // console.log(formData)
    e.preventDefault();
    try {
      const result = await login(formData);
      setLoggedIn(true);
      console.log(result);
      if(result.Title === "Success"){
        window.location.href = '/revenue';
      }else{
        setPopup({ show: true, title: result.Title, message: result.Message });
      }
    } catch (error) {
      setPopup({ show: true, title: 'Login Error', message: 'Invalid email or password' });
    }
  };

  const handleResetClick = () => {
    setShowResetModal(true);
  };

  const handleResetCancel = () => {
    setShowResetModal(false);
    setResetEmail('');
    setResetStatus('');
  };

  const handleResetSubmit = async () => {
    try {
      const status = await useReclaimPassword(resetEmail);
      setShowResetModal(false);
      setResetEmail('');
      setResetStatus('');
    } catch (error) {
      setPopup({ show: true, title: 'Reset Password Error', message: 'Unable to reset password' });
    }
  };

  const closePopup = () => {
    setPopup({ show: false, title: '', message: '' });
  };

  return (
    <div className={`login-form-container ${showResetModal ? 'modal-open' : ''}`}>
      <main>
        <img src={coverimages} alt="Cover" id="coverimage" />
        <form>
          <div className="wrapper">
            <img src={user} alt="User" id="userlogo" />
            <div className="input-box">
              <input
                type="text"
                name="email"
                id="email"
                placeholder="USERNAME"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="PASSWORD"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="remember-forgot">
              <a href="#/" onClick={handleResetClick}>Forgot account?</a>
            </div>
          </div>
          <button type="submit" disabled={loading} onClick={handleSubmit}>
            SIGN IN
          </button>
        </form>
      </main>
      <footer>
        <p className="footer">
          <span style={{ fontWeight: 700 }}>Văn phòng giao dịch:</span> Tầng 15,
          tòa nhà Detech, 8c Tôn Thất Thuyết, quận Nam Từ Liêm, Hà Nội
        </p>
      </footer>
      {showResetModal && (
        <>
          <div className="overlay" onClick={handleResetCancel}></div>
          <div className="modals">
            <div className="modal-content">
              <AiOutlineClose onClick={handleResetCancel} className="close-icon" />
              <h2>ĐỔI MẬT KHẨU</h2>
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>
            <button onClick={handleResetSubmit}>SUBMIT</button>
            {resetStatus && <p className="reset-status">{resetStatus}</p>}
          </div>
        </>
      )}
      {popup.show && <Popup title={popup.title} message={popup.message} onClose={closePopup} />}
    </div>
  );
};

export default LoginForm;
