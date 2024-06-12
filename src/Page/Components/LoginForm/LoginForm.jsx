import { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import coverimages from "../../../assets/images/coverimages.png";
import user from "../../../assets/images/user.png";
import useLogin from '../../../hooks/useLogin';
import { AiOutlineClose } from "react-icons/ai";
import useReclaimPassword from '../../../hooks/useReclaimPassword';

export const LoginForm = () => {
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
    e.preventDefault();
    try {
      login(formData);
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
        console.log(status);
        setShowResetModal(false);
        setResetEmail('');
        setResetStatus('');
    } catch (error) {
      console.error('Reset password error:', error);
    }
  };

  return (
    <div>
      <main>
        <img src={coverimages} alt="" id="coverimage" />
        <form>
          <div className="wrapper">
            <img src={user} alt="" id="userlogo" />
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
              <a href="#/" onClick={handleResetClick} >Forgot account? </a>
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
          tòa nhà Detech, 8c Tôn Thất Thuyết, quận Nam Từ Liêm, Hà Nội{" "}
        </p>
      </footer>
      {showResetModal && (
        <div className="modals">
          <div className="modal-content">
            <AiOutlineClose onClick={handleResetCancel} className="close-icon" />
            <h2>Reset Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <button onClick={handleResetSubmit}>Submit</button>
            {resetStatus && <p className="reset-status">{resetStatus}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;