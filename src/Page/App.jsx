import { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import coverimages from "./../assets/images/coverimages.png";
import user from "./../assets/images/user.png";
import useLogin from './../hooks/useLogin';
import { AiOutlineClose } from "react-icons/ai";
import useReclaimPassword from '../hooks/useReclaimPassword';

export const LoginForm = () => {
  const { login, loading} = useLogin(); 
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

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
  };

  const handleResetSubmit = async () => {
    try {
      console.log(resetEmail)
      const status = await useReclaimPassword(resetEmail);
      console.log(status)
      setShowResetModal(false);
      setResetEmail('');
    } catch (error) {
      console.error('Reset password error:', error);
    }
  };

  return (
    <div>
        <header>
          <img src={coverimages} alt="" id="coverimage"/>
            <form>
                <div className='wrapper'>
                    <img src={user} alt="" id='userlogo'/>
                    <div className="input-box">
                        <input type="text" 
                          name="email" 
                          id="email" 
                          placeholder='USER NAME' 
                          value={formData.email}
                          onChange={handleChange}
                          required 
                        />
                        <FaUser className='icon'/>
                    </div>
                    <div className="input-box">
                        <input type="password" 
                          name="password" 
                          id="password" 
                          placeholder='PASSWORD' 
                          value={formData.password}
                          onChange={handleChange}
                          required 
                        />
                        <FaLock className='icon'/>
                    </div>
                    <div className="remember-forgot">
                        <a href="#/" onClick={handleResetClick}>Forgot account ?</a>
                    </div>
                </div>
                <button type="submit" disabled={loading} onClick={handleSubmit}>Login</button>
            </form>
        </header>
        <footer>
            <p className='footer'>Văn phòng giao dịch:Tầng 15, tòa nhà Detech, 8c Tôn Thất Thuyết, quận Nam Từ Liêm, Hà Nội </p>
        </footer>

        {showResetModal && (
          <div className="modal">
            <AiOutlineClose onClick={handleResetCancel} className="close-icon" />
            <div className="modal-content">
                <h2>Reset Password</h2>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={resetEmail} 
                  onChange={(e) => setResetEmail(e.target.value)} 
                />
                <button onClick={handleResetSubmit}>Submit</button>
              </div>
          </div>
        )}
    </div>
  )
}

export default LoginForm;
