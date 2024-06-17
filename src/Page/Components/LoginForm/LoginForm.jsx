import React, { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import coverimages from "../../../assets/images/coverimages.png";
import user from "../../../assets/images/user.png";
import useLogin from '../../../hooks/useLogin.js';
import useReclaimPassword from '../../../hooks/useReclaimPassword';

const LoginForm = ({ setLoggedIn }) => {
  const { login, loading } = useLogin();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    try {
      const status = login(formData);
      console.log(status)
      setLoggedIn(true);
      // window.location.href = '/home/revenue';
    } catch (error) {
      console.error('Login error:', error);
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
      console.error('Reset password error:', error);
    }
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
              <h2>RESET PASSWORD</h2>
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
    </div>
  );
};

export default LoginForm;
