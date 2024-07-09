import React, { useEffect } from "react";
import "./notFound.css";
import useAuthStore from "../../../store/authStore.js";

// import logo from './logo.png'; // Ensure you have a logo image file in your project

const NotFoundPage = () => {
  const { user, setUser } = useAuthStore();
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user-info"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, [setUser]);
  return (
    <div className="not-found">
      {/* <img src={logo} alt="Company Logo" className="gas-station-logo" /> */}
      <div className="not-found-container">
        <div className="titleError">404</div>
        <hr />
        <p>{user ? "Trang Không Tồn Tại" : "Cần Đăng Ký"}</p>
        {user ? <a href="/">Quay về</a> : <a href="/auth">Quay về</a>}
      </div>
    </div>
  );
};

export default NotFoundPage;
