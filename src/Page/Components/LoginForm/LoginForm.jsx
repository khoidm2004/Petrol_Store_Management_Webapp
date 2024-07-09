// LoginForm.js
import React, { useState } from "react";
import "./LoginForm.css";
import { AiOutlineClose } from "react-icons/ai";
import coverimages from "../../../assets/images/coverimages.png";
import user from "../../../assets/images/user.png";
import useLogin from "../../../hooks/useLogin.js";
import useReclaimPassword from "../../../hooks/useReclaimPassword";
import Popup from "../Popup/Popup";
import Footer from "../Footer/Footer.jsx";

const LoginForm = () => {
  const { login, loading } = useLogin();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState("");
  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setPopup({
        show: true,
        title: "Thông báo",
        message: "Vui lòng nhập đầy đủ thông tin.",
        status: "warning",
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      setPopup({
        show: true,
        title: "Thông báo",
        message: "Vui lòng nhập đúng định dạng email.",
        status: "error",
      });
      return;
    }
    try {
      const result = await login(formData);
      if (result.Title === "Success") {
        window.location.href = "/";
      } else {
        setPopup({
          show: true,
          title: result.Title,
          message: result.Message,
          status: result.Status,
        });
      }
    } catch (error) {
      setPopup({
        show: true,
        title: "Login Error",
        message: "Invalid email or password",
        status: "error",
      });
    }
  };

  const handleResetClick = () => {
    setShowResetModal(true);
  };

  const handleResetCancel = () => {
    setShowResetModal(false);
    setResetEmail("");
    setResetStatus("");
  };

  const handleResetSubmit = async () => {
    if (!resetEmail) {
      setPopup({
        show: true,
        title: "Thông báo",
        message: "Vui lòng nhập đầy đủ thông tin.",
        status: "warning",
      });
      return;
    }

    if (!validateEmail(resetEmail)) {
      setPopup({
        show: true,
        title: "Thông báo",
        message: "Vui lòng nhập đúng định dạng email.",
        status: "error",
      });
      return;
    }
    try {
      const result = await useReclaimPassword(resetEmail);
      setPopup({
        show: true,
        title: "Thông báo",
        message: result.Message,
        status: result.Status,
      });
      setShowResetModal(false);
      setResetEmail("");
      setResetStatus("");
    } catch (error) {
      setPopup({
        show: true,
        title: "Reset Password Error",
        message: "Unable to reset password",
        status: "error",
      });
    }
  };

  const closePopup = () => {
    setPopup({ show: false, title: "", message: "", status: "" });
  };

  return (
    <div
      className={`login-form-container ${showResetModal ? "modal-open" : ""}`}
    >
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
              <a href="#/" onClick={handleResetClick}>
                Forgot account?
              </a>
            </div>
          </div>
          <button type="submit" disabled={loading} onClick={handleSubmit}>
            SIGN IN
          </button>
        </form>
      </main>
      <Footer />
      {showResetModal && (
        <>
          <div className="overlay" onClick={handleResetCancel}></div>
          <div className="modals">
            <div className="modal-content">
              <AiOutlineClose
                onClick={handleResetCancel}
                className="close-icon"
              />
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
      {popup.show && (
        <Popup
          title={popup.title}
          message={popup.message}
          status={popup.status}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default LoginForm;
