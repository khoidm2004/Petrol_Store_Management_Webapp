import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogout from "../../../hooks/useLogout";

const Logout = () => {
  const navigate = useNavigate();
  const { handleLogout } = useLogout();

  useEffect(() => {
    handleLogout();
    navigate("/auth");
  }, [navigate]);

  return null;
};

export default Logout;
