import React from 'react';
import "./notFound.css";
// import logo from './logo.png'; // Ensure you have a logo image file in your project

const NotFoundPage = () => {
  return (
    <div className="not-found">
      {/* <img src={logo} alt="Company Logo" className="gas-station-logo" /> */}
      <div className="not-found-container">
        <div className="titleError">404</div>
        <hr />
        <p>Trang Không Tồn Tại</p>
        <a href="/">Quay về trang chủ</a>
      </div>
    </div>
  );
};

export default NotFoundPage;
