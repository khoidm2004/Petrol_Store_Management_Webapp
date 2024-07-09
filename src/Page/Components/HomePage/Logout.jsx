import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogout from "../../../hooks/useLogout";

const Logout = ({ setLoggedIn }) => {
  const navigate = useNavigate();
  const { handleLogout } = useLogout();

  useEffect(() => {
    setLoggedIn(false);
    handleLogout();
    navigate("/auth");
  }, [navigate, setLoggedIn]);

  return null;
};

export default Logout;
