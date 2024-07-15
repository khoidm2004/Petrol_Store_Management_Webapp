import { useEffect } from "react";
import "./notFound.css";
import useAuthStore from "../../../store/authStore.js";

const NotFoundPage = () => {
  const { user, setUser } = useAuthStore();
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user-info"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, [setUser]);
  return (
    <div className="not-found">
      <div className="not-found-container">
        <div className="titleError">{user ? "404" : "401"}</div>
        <hr />
        <p>{user ? "Trang Không Tồn Tại" : "Cần Đăng Ký"}</p>
        {user ? <a href="/">Quay về</a> : <a href="/auth">Quay về</a>}
      </div>
    </div>
  );
};

export default NotFoundPage;
