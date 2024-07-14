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
  const { editProfile, isLoading } = useEditProfile();
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
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    const minLengthMessage = "Mật khẩu phải có ít nhất 6 ký tự.";
    const uppercaseMessage = "Mật khẩu phải chứa ít nhất một chữ viết hoa.";
    const numberMessage = "Mật khẩu phải chứa ít nhất một số.";
    const specialCharMessage = "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.";

    let errorMessage = "";

    if (formPass.pass.length < 6) {
      errorMessage = minLengthMessage;
    } else if (!/[A-Z]/.test(formPass.pass)) {
      errorMessage = uppercaseMessage;
    } else if (!/\d/.test(formPass.pass)) {
      errorMessage = numberMessage;
    } else if (!/[@$!%*?&]/.test(formPass.pass)) {
      errorMessage = specialCharMessage;
    } else if (!passwordRegex.test(formPass.pass)) {
      errorMessage = "Mật khẩu không hợp lệ.";
    }

    setPasswordError(errorMessage);
  }, [formPass.pass]);

  useEffect(() => {
    if (selectedFile) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        avatar: selectedFile,
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

  const handleSave = async () => {
    try {
      if (selectedFile) {
        const result = await editProfile(profile, selectedFile);
        setPopup({
          show: true,
          title: result.Title,
          message: result.Message,
          status: result.Status,
        });
        setSelectedFile(null);
      }
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

    if (formPass.pass !== formPass.passNew) {
      setPopup({
        show: true,
        title: "Thông báo",
        message: "Vui lòng nhập trùng pass nhập lại.",
        status: "warning",
      });
      return;
    }

    if (passwordError !== "") {
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
      const test = await handleLogout();
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
  return (
    <div className="Staff">
      <div className="text-account">ACCOUNT</div>
      <div className="page_account">
        <div className="profile_image_section">
          <div
            onClick={() => document.getElementById("fileInput").click()}
            style={{ cursor: "pointer" }}
          >
            {
            profile.avatar === "" ? (
              <img src={userAccount} alt="Profile" className="profile_image" />
            ) : (
              <img src={profile.avatar} alt="Profile" className="profile_image" />
            )
          }
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
              type="number"
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

            <label htmlFor="pass">PASSWORD</label>
            <div className="rowPasswordForget">
              <input
                readOnly
                type="password"
                name="pass"
                value={profile.pass}
                onChange={handleChange}
                className="changePassWord"
              />
              <button className="buttonChangePass " onClick={handleResetClick}>
                Đổi mật khẩu
              </button>
            </div>
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
                  {passwordError && (
                    <span className="password-error">{passwordError}</span>
                  )}
                </div>
                <button onClick={handleChangePassword}>SUBMIT</button>
                {resetStatus && <p className="reset-status">{resetStatus}</p>}
              </div>
            </>
          )}

          <button type="button" className="button_account" onClick={handleSave}>
            SAVE
          </button>
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
