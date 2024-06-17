import React, { useState } from "react";
import { AiOutlineUnorderedList, AiOutlineClose } from "react-icons/ai";
import { IoMdPeople } from "react-icons/io";
import { FaSignOutAlt, FaBoxes } from "react-icons/fa";
import { Routes, Route, Link } from "react-router-dom";
import Product from "./Components/HomePage/Product.jsx";
import Tank from "./Components/HomePage/Tank.jsx";
import Pump from "./Components/HomePage/Pump.jsx";
import Shift from "./Components/HomePage/Shift.jsx";
import Staff from "./Components/HomePage/Staff.jsx";
import Account from "./Components/Account/Account.jsx";
import Revenue from "./Components/HomePage/Doanhthu.jsx";
import Logout from "./Components/HomePage/Logout.jsx";
import logo from "../assets/images/logo.png";
import "./Components/HomePage/HomePage.scss";

const Include = ({ setLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header>
        <div className="burger" onClick={toggleMenu}>
          {isMenuOpen ? (
            <AiOutlineClose className="tab_menu" />
          ) : (
            <AiOutlineUnorderedList className="tab_menu" />
          )}
        </div>
        <img src={logo} alt="Logo" id="logo" />
        <p className="title">
          CÔNG TY CP TIN HỌC VIỄN THÔNG PETROLIMEX <br />
          PETROLIMEX INFORMATION TECHNOLOGY AND TELECOMMUNICATION JSC
        </p>
      </header>
      <div className={`body ${isMenuOpen ? "menu-open" : ""}`}>
        <div className="navbar-menu tab" style={{ width: isMenuOpen ? 200 : 0 }}>
          <ul className="navbar__list">
            <div className="navbar__li-box">
              <li className="navbar__li">
                <Link className="menu-text" to="/home/revenue"> <IoMdPeople className="icon_menu" /> DOANH THU</Link>
              </li>
            </div>
            <div className="navbar__li-box">
              <li className="navbar__li">
                <Link className="menu-text" to="/home/shift"> <IoMdPeople className="icon_menu" />CA BAN</Link>
              </li>
            </div>
            <div className="navbar__li-box">
              <li className="navbar__li">
                <Link className="menu-text" to="/home/staff"> <FaBoxes className="icon_menu" /> NHÂN VIÊN</Link>
              </li>
            </div>
            <div className="navbar__li-box">
              <li className="navbar__li">
                <Link className="menu-text" to="/home/product"> <FaBoxes className="icon_menu" /> MẶT HÀNG</Link>
              </li>
            </div>
            <div className="navbar__li-box">
              <li className="navbar__li">
                <Link className="menu-text" to="/home/tank"> <FaBoxes className="icon_menu" /> BỂ</Link>
              </li>
            </div>
            <div className="navbar__li-box">
              <li className="navbar__li">
                <Link className="menu-text" to="/home/pump"> <FaBoxes className="icon_menu" />VÒI BƠM</Link>
              </li>
            </div>
            <div className="navbar__li-box">
              <li className="navbar__li">
                <Link className="menu-text" to="/home/account"> <FaBoxes className="icon_menu" />TÀI KHOẢN</Link>
              </li>
            </div>
            <div className="navbar__li-box">
              <li className="navbar__li">
                <Link className="menu-text" to="/home/logout"> <FaSignOutAlt className="icon_menu" /> ĐĂNG XUẤT</Link>
              </li>
            </div>
          </ul>
        </div>
        <Routes>
          <Route path="revenue" element={<Revenue />} />
          <Route path="shift" element={<Shift />} />
          <Route path="staff" element={<Staff />} />
          <Route path="product" element={<Product />} />
          <Route path="tank" element={<Tank />} />
          <Route path="pump" element={<Pump />} />
          <Route path="account" element={<Account />} />
          <Route path="logout" element={<Logout setLoggedIn={setLoggedIn} />} />
        </Routes>
      </div>
    </>
  );
};

export default Include;
