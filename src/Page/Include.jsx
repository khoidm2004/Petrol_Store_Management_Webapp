import React, { useState, useEffect } from "react";
import { TbReportSearch } from "react-icons/tb";
import { IoMdPeople } from "react-icons/io";
import { FaBoxes } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { AiOutlineShopping } from "react-icons/ai";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate, Link } from 'react-router-dom';
import Product from "./Components/HomePage/Product.jsx";
import Tank from "./Components/HomePage/Tank.jsx";
import Pump from "./Components/HomePage/Pump.jsx";
import Shift from "./Components/HomePage/Shift.jsx";
import Staff from "./Components/HomePage/Staff.jsx";
import Account from "./Components/Account/Account.jsx";
import Revenue from "./Components/HomePage/Doanhthu.jsx";
import Logout from "./Components/HomePage/Logout.jsx";
import { FaArrowCircleRight,  FaArrowCircleLeft} from "react-icons/fa";
import "./Components/HomePage/HomePage.scss";
import NotFoundPage from "./Components/NotFound/notFound.jsx";

const Include = ({ setLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductSubMenuOpen, setIsProductSubMenuOpen] = useState(false);
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [showMenu, setShowMenu] = useState(true); 
  const locationNone = useLocation();

  useEffect(() => {
    setShowMenu(locationNone.pathname !== '/404');
  }, [locationNone.pathname]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProductSubMenu = () => {
    setIsProductSubMenuOpen(!isProductSubMenuOpen);
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth <= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        event.target.closest(".navbar-menu") === null &&
        event.target.closest(".burger") === null
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isMenuOpen]);

  return (
    <>
      {
        showMenu && 
        <>
          <header className="header">
            <a href="http://localhost:5173/revenue">
              <span id="logo">PIACOM</span>
            </a>
            <p id="title_header">
              CÔNG TY CP TIN HỌC VIỄN THÔNG PETROLIMEX <br />
              PETROLIMEX INFORMATION TECHNOLOGY AND TELECOMMUNICATION JSC
            </p>
          </header>
        </>
      }
      <div className={`body ${isMenuOpen ? "menu-open" : ""}`}>
        {showMenu &&
        <>
        <div className="navbar-menu tab" style={{ width: isMenuOpen ? 200 : 0 }}>
          <ul className="navbar__list">
            <div className="navbar__li-box">
              <li className={`navbar__li ${isActive('/revenue') ? 'active' : ''}`}>
                <Link className="menu-text" to="/revenue">
                  <TbReportSearch className="icon_menu" /> DOANH THU
                </Link>
              </li>
            </div>
            <div className="navbar__li-box">
              <li className={`navbar__li ${isActive('/shift') ? 'active' : ''}`}>
                <Link className="menu-text" to="/shift">
                  <AiOutlineShopping className="icon_menu" /> CA BÁN
                </Link>
              </li>
            </div>
            <div className="navbar__li-box">
              <li className={`navbar__li ${isActive('/staff') ? 'active' : ''}`}>
                <Link className="menu-text" to="/staff">
                  <IoMdPeople className="icon_menu" /> NHÂN VIÊN
                </Link>
              </li>
            </div>
            <div className="navbar__li-box">
              <li className="navbar__li" onClick={toggleProductSubMenu}>
                <span className="menu-text" style={{ fontWeight: 'bold' }}>
                  <FaBoxes className="icon_menu" /> QUẢN LÝ
                </span>
              </li>
              {isProductSubMenuOpen && (
                <ul className="submenu">
                  <li className={`navbar__li ${isActive('/product') ? 'active' : ''}`}>
                    <Link className="menu-text menu-text-tab2" to="/product">
                      MẶT HÀNG
                    </Link>
                  </li>
                  <li className={`navbar__li ${isActive('/tank') ? 'active' : ''}`}>
                    <Link className="menu-text menu-text-tab2" to="/tank">
                      BỂ
                    </Link>
                  </li>
                  <li className={`navbar__li ${isActive('/pump') ? 'active' : ''}`}>
                    <Link className="menu-text menu-text-tab2" to="/pump">
                      VÒI BƠM
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </ul>

          <div className="burger" onClick={toggleMenu}>
              {isMenuOpen ? (
                 <FaArrowCircleLeft className="tab_menu tab_close"/>
              ) : (
               <></>
              )}
            </div>
          
          <div className="bottom-menu">
            <ul className="navbar__list">
              <div className="navbar__li-box">
                <li className={`navbar__li ${isActive('/account') ? 'active' : ''}`}>
                  <Link className="menu-text" to="/account">
                    <MdAccountCircle className="icon_menu" /> TÀI KHOẢN
                  </Link>
                </li>
              </div>
              <div className="navbar__li-box">
                <li className={`navbar__li ${isActive('/logout') ? 'active' : ''}`}>
                  <Link className="menu-text" to="/logout">
                    <IoLogOut className="icon_menu" /> ĐĂNG XUẤT
                  </Link>
                </li>
              </div>
            </ul>
          </div>
        </div>
        <div className="burger burgerCenter" onClick={toggleMenu}>
          {isMenuOpen ? (
            <></>
          ) : (
            <FaArrowCircleRight className="tab_menu"/>
          )}
        </div>
        </>}
        <Routes>
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/shift" element={<Shift />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/product" element={<Product />} />
          <Route path="/tank" element={<Tank />} />
          <Route path="/pump" element={<Pump />} />
          <Route path="/account" element={<Account />} />
          <Route path="/404" element={<NotFoundPage />} />
           <Route path="*" element={<Navigate to="/404" replace />} /> 
          <Route path="/logout" element={<Logout setLoggedIn={setLoggedIn} />} />
        </Routes>
      </div>
    </>
  );
};

export default Include;
