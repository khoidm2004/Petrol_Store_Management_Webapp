import React, { useState } from "react";
import { AiOutlineUnorderedList, AiOutlineClose } from "react-icons/ai";
import { TbReportSearch } from "react-icons/tb";
import { IoMdPeople } from "react-icons/io";
import { FaBoxes } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { AiOutlineShopping } from "react-icons/ai";
import { Routes, Route, Link, useLocation } from "react-router-dom";
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
  const [isProductSubMenuOpen, setIsProductSubMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProductSubMenu = () => {
    setIsProductSubMenuOpen(!isProductSubMenuOpen);
  };

  const isActive = (path) => location.pathname === path;

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
              <li className={`navbar__li ${isActive('/home/revenue') ? 'active' : ''}`}>
                <Link className="menu-text" to="/home/revenue">
                  <TbReportSearch className="icon_menu" /> DOANH THU
                </Link>
              </li>
            </div>
            <div className="navbar__li-box">
              <li className={`navbar__li ${isActive('/home/shift') ? 'active' : ''}`}>
                <Link className="menu-text" to="/home/shift">
                  <AiOutlineShopping className="icon_menu" /> CA BÁN
                </Link>
              </li>
            </div>
            <div className="navbar__li-box">
              <li className={`navbar__li ${isActive('/home/staff') ? 'active' : ''}`}>
                <Link className="menu-text" to="/home/staff">
                  <IoMdPeople className="icon_menu" /> NHÂN VIÊN
                </Link>
              </li>
            </div>
            <div className="navbar__li-box">
              <li className="navbar__li" onClick={toggleProductSubMenu}>
                <span className="menu-text"  style={{ fontWeight: 'bold' }}>
                  <FaBoxes className="icon_menu" /> SẢN PHẨM
                </span>
              </li>
              {isProductSubMenuOpen && (
                <ul className="submenu">
                  <li className={`navbar__li ${isActive('/home/product') ? 'active' : ''}`}>
                    <Link className="menu-text" to="/home/product">
                      MẶT HÀNG
                    </Link>
                  </li>
                  <li className={`navbar__li ${isActive('/home/tank') ? 'active' : ''}`}>
                    <Link className="menu-text" to="/home/tank">
                      BỂ
                    </Link>
                  </li>
                  <li className={`navbar__li ${isActive('/home/pump') ? 'active' : ''}`}>
                    <Link className="menu-text" to="/home/pump">
                      VÒI BƠM
                    </Link>
                  </li>
                </ul>
              )}
            </div>
            <div className="navbar__li-box">
              <li className={`navbar__li ${isActive('/home/account') ? 'active' : ''}`}>
                <Link className="menu-text" to="/home/account">
                  <MdAccountCircle className="icon_menu" /> TÀI KHOẢN
                </Link>
              </li>
            </div>
            <div className="navbar__li-box">
              <li className={`navbar__li ${isActive('/home/logout') ? 'active' : ''}`}>
                <Link className="menu-text" to="/home/logout">
                  <IoLogOut className="icon_menu" /> ĐĂNG XUẤT
                </Link>
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
