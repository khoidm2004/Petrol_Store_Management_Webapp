import { useState, useEffect } from "react";
import "./Account.css";
import usePreviewImage from "../../../hooks/usePreviewImage";
import useEditProfile from "../../../hooks/useEditProfile";

export const Account = () => {
  const user = JSON.parse(localStorage.getItem("user-info")) || {};

  const [profile, setProfile] = useState({
    uid: user.uid,
    fullName: user.fullName || "",
    email: user.email || "",
    phoneNum: user.phoneNum || "",
    storeName: user.storeName || "",
    pass: user.pass || "",
    avatar: user.avatar || "",
  });

  const { selectedFile, setSelectedFile, handleImageChange } =
    usePreviewImage();

  const { editProfile, isLoading } = useEditProfile();

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
            <input
              readOnly
              type="password"
              name="pass"
              value={profile.pass}
              onChange={handleChange}
            />
          </div>

          <button type="button" className="button_account" onClick={handleSave}>
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
