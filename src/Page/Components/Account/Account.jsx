import { useState, useEffect } from "react";
import "./Account.css";
import usePreviewImage from "../../../hooks/usePreviewImage";
import useEditProfile from "../../../hooks/useEditProfile";
import { AiOutlineClose } from "react-icons/ai";
import useChangePassword from "../../../hooks/useChangePassword";
import Popup from "../Popup/Popup";
import useLogout from "../../../hooks/useLogout";
import Footer from "../Footer/Footer";
import userAccount from "../../../assets/images/userAccount.png";

import { useNavigate } from "react-router-dom";

export const Account = () => {
  const user = JSON.parse(localStorage.getItem("user-info")) || {};
  const { handleLogout } = useLogout();
  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
    status: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordOld, setPasswordOld] = useState("");
  const { editProfile } = useEditProfile();
  const [formPass, setFormPass] = useState({ pass: "", passNew: "" });
  const [profile, setProfile] = useState({
    uid: user.uid,
    fullName: user.fullName || "",
    email: user.email || "",
    phoneNum: user.phoneNum || "",
    storeName: user.storeName || "",
    pass: user.pass || "",
    avatar: user.avatar || "",
  });

  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = localStorage.getItem("user-info");
    if (!userInfo) {
      navigate("/404");
    }
  }, [navigate]);

  const { selectedFile, error, setSelectedFile, handleImageChange } =
    usePreviewImage();

  useEffect(() => {
    const errors = [];

    if (formPass.pass.length < 6) {
      errors.push("Mật khẩu phải có ít nhất 6 ký tự.");
    }
    if (!/[A-Z]/.test(formPass.pass)) {
      errors.push("Mật khẩu phải chứa ít nhất một chữ viết hoa.");
    }
    if (!/\d/.test(formPass.pass)) {
      errors.push("Mật khẩu phải chứa ít nhất một số.");
    }
    if (!/[@$!%*?&]/.test(formPass.pass)) {
      errors.push("Mật khẩu phải chứa ít nhất một ký tự đặc biệt.");
    }
    setPasswordError(errors);
  }, [formPass.pass]);

  useEffect(() => {
    if (selectedFile) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        avatar: selectedFile || "",
      }));
    }
  }, [selectedFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const validatePhoneNumber = (phoneNum) => {
    const re = /^\d{10}$/;
    return re.test(String(phoneNum));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSave = async () => {
    try {
      if (
        !profile.phoneNum ||
        !profile.fullName ||
        !profile.email ||
        !profile.storeName
      ) {
        setPopup({
          show: true,
          title: "Thông báo",
          message: "Vui lòng nhập đầy đủ thông tin.",
          status: "warning",
        });
        return;
      }

      if (!validateEmail(profile.email)) {
        setPopup({
          show: true,
          title: "Thông báo",
          message: "Vui lòng nhập đúng định dạng của email.",
          status: "warning",
        });
        return;
      }

      if (!validatePhoneNumber(profile.phoneNum)) {
        setPopup({
          show: true,
          title: "Thông báo",
          message: "Vui lòng nhập đúng định dạng của số điện thoại.",
          status: "warning",
        });
        return;
      }

      const result = await editProfile(profile, selectedFile);
      setPopup({
        show: true,
        title: result.Title,
        message: result.Message,
        status: result.Status,
      });
      setSelectedFile(null);
    } catch (error) {
      return { Title: "Error" };
    }
  };

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStatus, setResetStatus] = useState("");
  const handleResetClick = () => {
    setShowResetModal(true);
  };

  const handleResetCancel = () => {
    setShowResetModal(false);
    setResetStatus("");
  };

  const handleChangePass = (e) => {
    const { name, value } = e.target;
    setFormPass({ ...formPass, [name]: value });
  };

  const handleChangePassword = async () => {
    if (!formPass.pass || !formPass.pass) {
      setPopup({
        show: true,
        title: "Thông báo",
        message: "Vui lòng nhập đầy đủ thông tin để đổi mậu khẩu.",
        status: "warning",
      });
      return;
    }

    const passLocal = JSON.parse(localStorage.getItem("user-info"));
    if (passLocal.pass.trim() !== passwordOld.trim()) {
      setPopup({
        show: true,
        title: "Thông báo",
        message: "Mật khẩu cũ không chính xác.",
        status: "warning",
      });
      return;
    }
    if (formPass.pass !== formPass.passNew) {
      setPopup({
        show: true,
        title: "Thông báo",
        message: "Vui lòng nhập trùng pass nhập lại.",
        status: "warning",
      });
      return;
    }

    if (passwordError.length > 0) {
      setPopup({
        show: true,
        title: "Thông báo",
        message: "Vui lòng lập đủ điều kiện.",
        status: "warning",
      });
      return;
    }

    const result = await useChangePassword(
      formPass.pass,
      profile.email,
      profile.pass,
      profile.uid
    );
    if (result) {
      setPopup({
        show: true,
        title: "Thông báo",
        message: "Đổi thành công",
        status: "success",
      });
      await handleLogout();
      window.location.href = "/";
    } else {
      setPopup({
        show: true,
        title: result.Title,
        message: result.Message,
        status: result.Status,
      });
    }
  };

  const closePopup = () => {
    setPopup({ show: false, title: "", message: "", status: "error" });
  };

  const handleOldPasswordChange = (e) => {
    setPasswordOld(e.target.value);
  };
  return (
    <div className="Staff">
      <div className="page_account">
        <div className="profile_image_section">
          <div
            onClick={() => document.getElementById("fileInput").click()}
            style={{ cursor: "pointer" }}
          >
            {profile.avatar === "" ? (
              <img src={userAccount} alt="Profile" className="profile_image" />
            ) : (
              <img
                src={profile.avatar}
                alt="Profile"
                className="profile_image"
              />
            )}
          </div>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className="button_account"
            onClick={() => document.getElementById("fileInput").click()}
          >
            CHANGE
          </button>
        </div>

        <div className="profile_info_section">
          <div className="profile_info">
            <label htmlFor="fullName">NAME</label>
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
            />
            <label htmlFor="email">EMAIL</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="email"
            />

            <label htmlFor="phoneNum">PHONE NUMBER</label>
            <input
              type="text"
              name="phoneNum"
              value={profile.phoneNum}
              onChange={handleChange}
            />

            <label htmlFor="storeName">QUẢN LÝ CỬA HÀNG</label>
            <input
              type="text"
              name="storeName"
              value={profile.storeName}
              onChange={handleChange}
            />
          </div>
          {showResetModal && (
            <>
              <div className="overlay" onClick={handleResetCancel}></div>
              <div className="modals">
                <div className="modal-content">
                  <AiOutlineClose
                    onClick={handleResetCancel}
                    className="close-icon"
                  />
                  <h2>Đổi mật khẩu</h2>
                  <input
                    type="password"
                    name="pass"
                    placeholder="Mật khẩu cũ"
                    value={passwordOld}
                    onChange={handleOldPasswordChange}
                  />
                  <input
                    type="password"
                    name="pass"
                    placeholder="Mật khẩu mới"
                    value={formPass.pass}
                    onChange={handleChangePass}
                  />
                  <input
                    type="password"
                    name="passNew"
                    placeholder="Nhập lại mật khẩu"
                    value={formPass.passNew}
                    onChange={handleChangePass}
                  />
                  {passwordError.length > 0 &&
                    passwordError.map((error, index) => (
                      <span key={index} className="password-error">
                        {error}
                      </span>
                    ))}
                </div>
                <button onClick={handleChangePassword}>SUBMIT</button>
                {resetStatus && <p className="reset-status">{resetStatus}</p>}
              </div>
            </>
          )}
          <div className="rowButton">
            <button
              type="button"
              className="button_account"
              onClick={handleSave}
            >
              SAVE
            </button>
            <button className="button_account" onClick={handleResetClick}>
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>
      <Footer />
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

export default Account;
