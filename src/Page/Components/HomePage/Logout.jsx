import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogout from "../../../hooks/useLogout";

const Logout = ({ setLoggedIn }) => {
  const navigate = useNavigate();
  const { handleLogout } = useLogout();
  
  useEffect(() => {
    setLoggedIn(false);
    const test = handleLogout();
    navigate("/");
  }, [navigate, setLoggedIn]);

  return null;
};

export default Logout;
