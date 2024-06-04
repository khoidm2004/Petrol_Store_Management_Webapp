import React, { useState } from "react";
import './HomePage.scss';
import { AiOutlineUnorderedList, AiOutlineClose } from "react-icons/ai";
import { AiOutlineAppstore, AiOutlineUser, AiTwotoneShopping} from "react-icons/ai";
import { IoMdPeople } from "react-icons/io";
import { FaSignOutAlt,FaBoxes } from "react-icons/fa";
import logo from "../../assets/images/logo.png";
import LoginForm from "../../App.jsx";
import Staff from "./Staff.jsx";
import '../CSS/LoginForm.css';

import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";


export function Include() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <BrowserRouter>
      <header>
        <div className="burger" onClick={toggleMenu}>
            {isMenuOpen ? <AiOutlineClose className='iconmenu' /> : <AiOutlineUnorderedList className='iconmenu' />}
          </div>
          <img src={logo} alt="Logo" id='logo' />
          <p className='title'>
            CÔNG TY CP TIN HỌC VIỄN THÔNG PETROLIMEX <br />
            PETROLIMEX INFORMATION TECHNOLOGY AND TELECOMMUNICATION JSC
          </p>
      </header>
      <div className={`body ${isMenuOpen ? 'menu-open' : ''}`}>
        <div className="navbar-menu tab" style={{ width: isMenuOpen ? 200 : 0 }}>
            <ul className="navbar__list"> 
              <div className="navbar__li-box">
                <li className="navbar__li">
                  <AiOutlineAppstore className='iconmenu'/>
                  <a className="active" href="/">Home</a>
                </li>
              </div>
            </ul>
            <ul className="navbar__list"> 
              <div className="navbar__li-box">
                <li className="navbar__li">
                  <AiTwotoneShopping className='iconmenu'/>
                  <a href="/"> DOANH THU </a>
                </li>
              </div>
            </ul>
            <ul className="navbar__list"> 
              <div className="navbar__li-box">
                <li className="navbar__li">
                  <IoMdPeople className='iconmenu'/>
                  <a href="/shiff"> CA BAN</a>
                </li>
              </div>
            </ul>
            <ul className="navbar__list"> 
              <div className="navbar__li-box">
                <li className="navbar__li">
                  <FaBoxes  className='iconmenu'/>
                  <a href="/staff"> NHAN VIEN</a>
                </li>
              </div>
            </ul>
            <ul className="navbar__list"> 
              <div className="navbar__li-box">
                <li className="navbar__li">
                  <AiOutlineUser className='iconmenu'/>
                  <a href="/staff"> SAN PHAM</a>
                </li>
              </div>
            </ul>
            <ul className="navbar__list"> 
              <div className="navbar__li-box">
                <li className="navbar__li">
                  <AiOutlineUser className='iconmenu'/>
                  <a href="/money"> TAI KHOAN</a>
                </li>
              </div>
            </ul>
            <ul className="navbar__list"> 
              <div className="navbar__li-box">
                <li className="navbar__li">
                  <FaSignOutAlt className='iconmenu'/>
                  <a href="/out"> DANG XUAT</a>
                </li>
              </div>
            </ul>
        </div>
        <Switch>
          <Route path="/" exact>
            <LoginForm />
          </Route>
          <Route path="/staff">
            <Staff />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}
