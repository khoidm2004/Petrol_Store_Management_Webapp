import { useState } from "react";
import "./LoginForm.css";
import coverimages from "../../../../assets/images/coverimages.png";
import user from "../../../../assets/images/user.png";
import useLogin from "../../../../hooks/useLogin";

const LoginForm = () => {
  const { login, loading } = useLogin();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      login(formData);
    } catch (error) {
      console.error("Login error:", error);
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
              <a href="#/">Forgot password ?</a>
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
    </div>
  );
};

export default LoginForm;
