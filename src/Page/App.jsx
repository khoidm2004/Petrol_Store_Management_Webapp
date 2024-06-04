import { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import logo from "./../assets/images/logo.png";
import coverimages from "./../assets/images/coverimages.png";
import user from "./../assets/images/user.png";
import useLogin from './../hooks/useLogin';

export const LoginForm = () => {
  const { login, loading} = useLogin(); 
  const [formData, setFormData] = useState({ email: '', password: '' });

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

  return (
    <div>
        <header>
            <img src={logo} alt="" id='logo' />
            <p className='title'>
                        CÔNG TY CP TIN HỌC VIỄN THÔNG PETROLIMEX <br></br>
            PETROLIMEX INFORMATION TECHNOLOGY AND TELECOMMUNICATION JSC
            </p>
        </header>
        <main>
            <img src={coverimages} alt="" id="coverimage"/>
            <form>
                <div className='wrapper'>
                    <img src={user} alt="" id='userlogo'/>
                    <div className="input-box">
                        <input 
                          type="text" 
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
                        <input 
                          type="password" 
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
                        <a href="#/">Forgot account ?</a>
                    </div>
                </div>
                <button type="submit" disabled={loading} onClick={handleSubmit}>Login</button>
            </form>
        </main>
        <footer>
            <p className='footer'>Văn phòng giao dịch:Tầng 15, tòa nhà Detech, 8c Tôn Thất Thuyết, quận Nam Từ Liêm, Hà Nội </p>
        </footer>
    </div>
  )
}

export default LoginForm;