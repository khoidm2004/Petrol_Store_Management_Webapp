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
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";
import { parseUserInfoFromStorage } from "../../../utils/userInfoStorage.js";

export const Account = () => {
  const { t } = useTranslation();
  const user = parseUserInfoFromStorage() || {};
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
      errors.push(t("account.passwordRuleLength"));
    }
    if (!/[A-Z]/.test(formPass.pass)) {
      errors.push(t("account.passwordRuleUpper"));
    }
    if (!/\d/.test(formPass.pass)) {
      errors.push(t("account.passwordRuleNumber"));
    }
    if (!/[@$!%*?&]/.test(formPass.pass)) {
      errors.push(t("account.passwordRuleSpecial"));
    }
    setPasswordError(errors);
  }, [formPass.pass, t]);

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
    const re = /^(?:\+84|0|84|0084)\d{9}$/;
    return re.test(String(phoneNum));
  };

  const validateEmail = (email) => {
    const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!basicEmailRegex.test(String(email).toLowerCase())) {
      return false;
    }
    const domainPart = email.split("@")[1];
    const noNumberAfterAtRegex = /^[^\d]+$/;
    if (!noNumberAfterAtRegex.test(domainPart)) {
      return false;
    }
    const validDomainRegex = /^[^\s@]+@(gmail\.com|outlook\.com)$/;
    if (!validDomainRegex.test(String(email).toLowerCase())) {
      return false;
    }
    return true;
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
          title: t("common.notification"),
          message: t("auth.requiredInfo"),
          status: "warning",
        });
        return;
      }

      if (!validateEmail(profile.email)) {
        setPopup({
          show: true,
          title: t("common.notification"),
          message: t("account.invalidEmail"),
          status: "warning",
        });
        return;
      }

      if (!validatePhoneNumber(profile.phoneNum)) {
        setPopup({
          show: true,
          title: t("common.notification"),
          message: t("account.invalidPhone"),
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
        title: t("common.notification"),
        message: t("account.requiredInfoPassword"),
        status: "warning",
      });
      return;
    }

    const passLocal = parseUserInfoFromStorage();
    if (!passLocal?.pass) {
      setPopup({
        show: true,
        title: t("common.notification"),
        message: t("account.requiredInfoPassword"),
        status: "warning",
      });
      return;
    }
    if (passLocal.pass.trim() !== passwordOld.trim()) {
      setPopup({
        show: true,
        title: t("common.notification"),
        message: t("account.wrongOldPassword"),
        status: "warning",
      });
      return;
    }
    if (formPass.pass !== formPass.passNew) {
      setPopup({
        show: true,
        title: t("common.notification"),
        message: t("account.passwordMismatch"),
        status: "warning",
      });
      return;
    }

    if (passwordError.length > 0) {
      setPopup({
        show: true,
        title: t("common.notification"),
        message: t("account.passwordConditions"),
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
        title: t("common.notification"),
        message: t("account.changeSuccess"),
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
            {t("account.change")}
          </button>
        </div>

        <div className="profile_info_section">
          <div className="profile_info">
            <label htmlFor="fullName">{t("account.name")}</label>
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

            <label htmlFor="phoneNum">{t("account.phone")}</label>
            <input
              type="text"
              name="phoneNum"
              value={profile.phoneNum}
              onChange={handleChange}
            />

            <label htmlFor="storeName">{t("account.storeManager")}</label>
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
                  <h2>{t("account.changePassword")}</h2>
                  <input
                    type="password"
                    name="pass"
                    placeholder={t("account.oldPassword")}
                    value={passwordOld}
                    onChange={handleOldPasswordChange}
                  />
                  <input
                    type="password"
                    name="pass"
                    placeholder={t("account.newPassword")}
                    value={formPass.pass}
                    onChange={handleChangePass}
                  />
                  <input
                    type="password"
                    name="passNew"
                    placeholder={t("account.confirmPassword")}
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
                <button onClick={handleChangePassword}>{t("common.submit")}</button>
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
              {t("account.saveProfile")}
            </button>
            <button className="button_account" onClick={handleResetClick}>
              {t("account.changePasswordBtn")}
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
