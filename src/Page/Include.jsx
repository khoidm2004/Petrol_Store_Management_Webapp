import { useState, useEffect } from "react";
import { TbReportSearch } from "react-icons/tb";
import { IoMdPeople } from "react-icons/io";
import { FaBoxes, FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { AiOutlineShopping } from "react-icons/ai";
import {
  Route,
  Routes,
  useLocation,
  Link,
  useNavigate,
} from "react-router-dom";
import Product from "./Components/HomePage/Product.jsx";
import Tank from "./Components/HomePage/Tank.jsx";
import Pump from "./Components/HomePage/Pump.jsx";
import Shift from "./Components/HomePage/Shift.jsx";
import Staff from "./Components/HomePage/Staff.jsx";
import Account from "./Components/Account/Account.jsx";
import Revenue from "./Components/HomePage/Doanhthu.jsx";
import NotFound from "./Components/NotFound/notFound.jsx";
import "./Components/HomePage/HomePage.scss";
import useLogout from "../hooks/useLogout.js";

const Include = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductSubMenuOpen, setIsProductSubMenuOpen] = useState(false);
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  const routes = [
    "/",
    "/shift",
    "/staff",
    "/product",
    "/tank",
    "/pump",
    "/account",
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProductSubMenu = () => {
    setIsProductSubMenuOpen(!isProductSubMenuOpen);
  };

  const isActive = (path) => currentPath === path;

  useEffect(() => {
    const handleResize = () => {
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
        !event.target.closest(".navbar-menu") &&
        !event.target.closest(".burger")
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const navigate = useNavigate();
  const { handleLogout } = useLogout();

  const handleLogouts = () => {
    handleLogout();
    navigate("/auth");
  };

  return (
    <>
      {routes.includes(currentPath) && (
        <header className="header">
          <div className="burger burgerCenter" onClick={toggleMenu}>
            {isMenuOpen ? (
              <FaArrowCircleLeft className="tab_menu" />
            ) : (
              <FaArrowCircleRight className="tab_menu" />
            )}
          </div>
          <Link href="/" id="logoLink">
            <span id="logo">PIACOM</span>
          </Link>
          <p id="title_header">
            CÔNG TY CP TIN HỌC VIỄN THÔNG PETROLIMEX <br />
            PETROLIMEX INFORMATION TECHNOLOGY AND TELECOMMUNICATION JSC
          </p>
        </header>
      )}
      <div className={`body ${isMenuOpen ? "menu-open" : ""}`}>
        {routes.includes(currentPath) && (
          <nav className={`navbar-menu ${isMenuOpen ? "open" : ""}`}>
            <ul className="navbar__list">
              <div className="navbar__li-box">
                <li className={`navbar__li ${isActive("/") ? "active" : ""}`}>
                  <Link className="menu-text menu-text-tab1" to="/">
                    <TbReportSearch className="icon_menu" /> DOANH THU
                  </Link>
                </li>
              </div>
              <div className="navbar__li-box">
                <li
                  className={`navbar__li ${isActive("/shift") ? "active" : ""}`}
                >
                  <Link className="menu-text menu-text-tab1" to="/shift">
                    <AiOutlineShopping className="icon_menu" /> CA BÁN
                  </Link>
                </li>
              </div>
              <div className="navbar__li-box ">
                <li
                  className={`navbar__li ${isActive("/staff") ? "active" : ""}`}
                >
                  <Link className="menu-text menu-text-tab1" to="/staff">
                    <IoMdPeople className="icon_menu" /> NHÂN VIÊN
                  </Link>
                </li>
              </div>
              <div className="navbar__li-box">
                <li className="navbar__li" onClick={toggleProductSubMenu}>
                  <span className="menu-text menu-text-tab1" style={{ fontWeight: "bold" }}>
                    <FaBoxes className="icon_menu" /> CẤU HÌNH
                  </span>
                </li>
                {isProductSubMenuOpen && (
                  <ul className="submenu">
                    <li
                      className={`navbar__li ${
                        isActive("/product") ? "active" : ""
                      }`}
                    >
                      <Link className="menu-text menu-text-tab2" to="/product">
                        MẶT HÀNG
                      </Link>
                    </li>
                    <li
                      className={`navbar__li ${
                        isActive("/tank") ? "active" : ""
                      }`}
                    >
                      <Link className="menu-text menu-text-tab2" to="/tank">
                        BỂ
                      </Link>
                    </li>
                    <li
                      className={`navbar__li ${
                        isActive("/pump") ? "active" : ""
                      }`}
                    >
                      <Link className="menu-text menu-text-tab2" to="/pump">
                        VÒI BƠM
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </ul>
            <div className="bottom-menu">
              <ul className="navbar__list">
                <div className="navbar__li-box">
                  <li
                    className={`navbar__li ${
                      isActive("/account") ? "active" : ""
                    }`}
                  >
                    <Link className="menu-text menu-text-tab1" to="/account">
                      <MdAccountCircle className="icon_menu" /> TÀI KHOẢN
                    </Link>
                  </li>
                </div>
                <div className="navbar__li-box">
                  <li className="navbar__li">
                    <a className="menu-text menu-text-tab1" onClick={handleLogouts}>
                      <IoLogOut className="icon_menu" /> ĐĂNG XUẤT
                    </a>
                  </li>
                </div>
              </ul>
            </div>
          </nav>
        )}
        <Routes>
          <Route path="/" element={<Revenue />} />
          <Route path="/shift" element={<Shift />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/product" element={<Product />} />
          <Route path="/tank" element={<Tank />} />
          <Route path="/pump" element={<Pump />} />
          <Route path="/account" element={<Account />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

export default Include;
