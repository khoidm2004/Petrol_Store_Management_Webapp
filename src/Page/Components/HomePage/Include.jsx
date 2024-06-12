import React, { useState } from "react";
import "./HomePage.scss";
import { AiOutlineUnorderedList, AiOutlineClose } from "react-icons/ai";
import { AiOutlineUser } from "react-icons/ai";
import { IoMdPeople } from "react-icons/io";
import { FaSignOutAlt, FaBoxes } from "react-icons/fa";
import logo from "../../../assets/images/logo.png";
import Staff from "../../Components/HomePage/Staff.jsx";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Product from "../../Components/HomePage/Product.jsx";
import Tank from "../../Components/HomePage/Tank.jsx";
import Pump from "./Pump.jsx";
import Shift from "./Shift.jsx";
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
            <AiOutlineClose className="iconmenu" />
          ) : (
            <AiOutlineUnorderedList className="iconmenu" />
          )}
        </div>
        <img src={logo} alt="Logo" id="logo" />
        <p className="title">
          CÔNG TY CP TIN HỌC VIỄN THÔNG PETROLIMEX <br />
          PETROLIMEX INFORMATION TECHNOLOGY AND TELECOMMUNICATION JSC
        </p>
      </header>
      <div className={`body ${isMenuOpen ? "menu-open" : ""}`}>
        <div
          className="navbar-menu tab"
          style={{ width: isMenuOpen ? 200 : 0 }}
        >
          <ul className="navbar__list">
            <div className="navbar__li-box">
              <li className="navbar__li">
                <IoMdPeople className="iconmenu" />
                <a href="/shift"> CA BAN</a>
              </li>
            </div>
          </ul>
          <ul className="navbar__list">
            <div className="navbar__li-box">
              <li className="navbar__li">
                <FaBoxes className="iconmenu" />
                <a href="/staff"> NHAN VIEN</a>
              </li>
            </div>
          </ul>
          <ul className="navbar__list">
            <div className="navbar__li-box">
              <li className="navbar__li">
                <AiOutlineUser className="iconmenu" />
                <a href="/product"> MAT HANG</a>
              </li>
            </div>
          </ul>
          <ul className="navbar__list">
            <div className="navbar__li-box">
              <li className="navbar__li">
                <AiOutlineUser className="iconmenu" />
                <a href="/tank"> BE</a>
              </li>
            </div>
          </ul>
          <ul className="navbar__list">
            <div className="navbar__li-box">
              <li className="navbar__li">
                <AiOutlineUser className="iconmenu" />
                <a href="/pump"> VOI BOM</a>
              </li>
            </div>
          </ul>
          <ul className="navbar__list">
            <div className="navbar__li-box">
              <li className="navbar__li">
                <AiOutlineUser className="iconmenu" />
                <a href="/money"> TAI KHOAN</a>
              </li>
            </div>
          </ul>
          <ul className="navbar__list">
            <div className="navbar__li-box">
              <li className="navbar__li">
                <FaSignOutAlt className="iconmenu" />
                <a href="/out"> DANG XUAT</a>
              </li>
            </div>
          </ul>
        </div>
        <Switch>
          {/* <Route path="/" exact>
            <LoginForm />
          </Route> */}
          <Route path="/staff" exact>
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
        </Switch>
      </div>
    </BrowserRouter>
  );
}
