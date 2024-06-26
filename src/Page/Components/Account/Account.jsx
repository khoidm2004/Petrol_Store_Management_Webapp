import { useState, useEffect } from "react";
import "./Account.css";
import usePreviewImage from "../../../hooks/usePreviewImage";
import useEditProfile from "../../../hooks/useEditProfile";
import { AiOutlineClose } from "react-icons/ai";
import useChangePassword from "../../../hooks/useChangePassword";
import Popup from "../Popup/Popup";
import useLogout from "../../../hooks/useLogout";

export const Account = () => {
  const user = JSON.parse(localStorage.getItem("user-info")) || {};
  const { handleLogout } = useLogout();
  const [popup, setPopup] = useState({ show: false, title: "", message: "" });
  const [profile, setProfile] = useState({
    uid: user.uid,
    fullName: user.fullName || "",
    email: user.email || "",
    phoneNum: user.phoneNum || "",
    storeName: user.storeName || "",
    pass: user.pass || "",
    avatar: user.avatar || "",
  });

  const { selectedFile, error, setSelectedFile, handleImageChange } =
    usePreviewImage();

  const { editProfile, isLoading } = useEditProfile();
  const [formPass, setFormPass] = useState({ pass: "", passNew: "" });
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
    setResetStatus('');
  };

  const handleChangePass = (e) => {
    const { name, value } = e.target;
    setFormPass({ ...formPass, [name]: value });
  };


  const email_local = JSON.parse(localStorage.getItem('user-info'));
  // console.log(email_local.email);
  // console.log(email_local.pass);
  const handleChangePassword = async () => {
    const email_local = JSON.parse(localStorage.getItem('user-info'));
    if (formPass.pass === formPass.passNew) {
      try {

        const result = await useChangePassword(
          formPass.pass,
          profile.email,
          profile.pass,
          profile.uid
        );
        if (result) {
          setPopup({
            show: true,
            title: "Thành công",
            message: "Đổi thành công",
          });
          const test = await handleLogout();
          console.log(test);
          window.location.href = 'http://localhost:5173/';
        } else {
          setPopup({
            show: true,
            title: result.Title,
            message: result.Message,
          });
        }
      } catch (error) {
      }
    }else{
      setPopup({ show: true, title: 'Lỗi', message: 'Không trùng pass' });

    }
  };

  const closePopup = () => {
    setPopup({ show: false, title: '', message: '' });
  };
  return (
      <div className="Staff">
      <div className="text-account">ACCOUNT</div>
      <div className="page_account">
        <div className="profile_image_section">
          <img src={profile.avatar} alt="Profile" className="profile_image" />
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
            <div className="row_image">
              <input
                readOnly
                type="password"
                name="pass"
                value={profile.pass}
                onChange={handleChange}
                className="changePassWord"
              />
              <button className="buttonChangePass " onClick={handleResetClick}>Đổi mật khẩu</button>
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
      <footer className="footer_account">
        <p className="footer">
          <span style={{ fontWeight: 700 }}>Văn phòng giao dịch:</span> Tầng 15,
          tòa nhà Detech, 8c Tôn Thất Thuyết, quận Nam Từ Liêm, Hà Nội
        </p>
      </footer>
      {popup.show && <Popup title={popup.title} message={popup.message} onClose={closePopup} />}
    </div>
  );
};

export default Account;
