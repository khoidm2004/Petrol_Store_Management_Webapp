import "./notFound.css";
import useAuthStore from "../../../store/authStore.js";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  return (
    <div className="not-found">
      <div className="not-found-container">
        <div className="titleError">{user ? "404" : "401"}</div>
        <hr />
        <p>{user ? t("notFound.pageNotFound") : t("notFound.unauthorized")}</p>
        {user ? <a href="/">{t("common.back")}</a> : <a href="/auth">{t("common.back")}</a>}
      </div>
    </div>
  );
};

export default NotFound;
