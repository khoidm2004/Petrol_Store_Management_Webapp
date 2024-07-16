import "./notFound.css";
import useAuthStore from "../../../store/authStore.js";

const NotFound = () => {
  const { user } = useAuthStore();

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

export default NotFound;
