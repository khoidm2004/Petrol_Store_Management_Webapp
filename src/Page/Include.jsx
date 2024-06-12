import React, { useState } from "react";
import "./Components/HomePage/HomePage.scss";
import { AiOutlineUnorderedList, AiOutlineClose } from "react-icons/ai";
import { AiOutlineUser } from "react-icons/ai";
import { IoMdPeople } from "react-icons/io";
import { FaSignOutAlt, FaBoxes } from "react-icons/fa";
import logo from "../assets/images/logo.png";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Product from "./Components/HomePage/Product.jsx";
import Tank from "./Components/HomePage/Tank.jsx";
import Pump from "./Components/HomePage/Pump.jsx";
import Shift from "./Components/HomePage/Shift.jsx";
import Staff from "./Components/HomePage/Staff.jsx";
import Account from "./Components/Account/Account.jsx";
import Revenue from "./Components/HomePage/Doanhthu.jsx";
import { BsDisplay } from "react-icons/bs";

export function Include() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <BrowserRouter>
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
                <IoMdPeople className="icon_menu" />
                <a className="menu-text" href="/revenue"> DOANH THU</a>
              </li>
            </div>
          </ul>
          <ul className="navbar__list">
            <div className="navbar__li-box">
              <li className="navbar__li">
                <IoMdPeople className="icon_menu" />
                <a className="menu-text" href="/shift"> CA BAN</a>
              </li>
            </div>
          </ul>
          <ul className="navbar__list">
            <div className="navbar__li-box">
              <li className="navbar__li">
                <FaBoxes className="icon_menu" />
                <a className="menu-text" href="/staff"> NHAN VIEN</a>
              </li>
            </div>
          </ul>
          <ul className="navbar__list">
            <div className="navbar__li-box">
              <li className="navbar__li">
                <AiOutlineUser className="icon_menu" />
                <a className="menu-text" href="/product"> MAT HANG</a>
              </li>
            </div>
          </ul>
          <ul className="navbar__list">
            <div className="navbar__li-box">
              <li className="navbar__li">
                <AiOutlineUser className="icon_menu" />
                <a className="menu-text" href="/tank"> BE</a>
              </li>
            </div>
          </ul>
          <ul className="navbar__list">
            <div className="navbar__li-box">
              <li className="navbar__li">
                <AiOutlineUser className="icon_menu" />
                <a className="menu-text" href="/pump"> VOI BOM</a>
              </li>
            </div>
          </ul>
          <ul className="navbar__list">
            <div className="navbar__li-box">
              <li className="navbar__li">
                <AiOutlineUser className="icon_menu" />
                <a className="menu-text" href="/account"> TAI KHOAN</a>
              </li>
            </div>
          </ul>
          <ul className="navbar__list">
            <div className="navbar__li-box">
              <li className="navbar__li">
                <FaSignOutAlt className="icon_menu" />
                <a className="menu-text" href="/out"> DANG XUAT</a>
              </li>
            </div>
          </ul>
        </div>
        <Switch>
          <Route path="/revenue" exact>
            <Revenue />
          </Route>
          <Route path="/staff">
            <Staff />
          </Route>
          <Route path="/product">
            <Product />
          </Route>
          <Route path="/tank">
            <Tank />
          </Route>
          <Route path="/pump">
            <Pump />
          </Route>
          <Route path="/shift">
            <Shift />
          </Route>
          <Route path="/account">
            <Account />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default Include;

