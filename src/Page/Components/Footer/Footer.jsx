import "./Footer.css";
import { FaFacebookF } from "react-icons/fa";
import { MdMailOutline } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="footer_container">
        <div className="footer_info">
          <h1>PIACOM</h1>
          <h4>{t("footer.companyName")}</h4>
          <div className="footer_info_email">
            <p>
              <span>{t("footer.email")}</span> info.piacom@petrolimex.com.vn
            </p>
          </div>
          <div className="footer_info_content">
            <p>
              <span>{t("footer.office")}</span> {t("footer.officeAddress")}
            </p>
            <p>
              <span>{t("footer.southBranch")} </span> {t("footer.southBranchAddress")}
            </p>
          </div>
          <div className="footer_info_icons_container">
            <a
              href="https://www.facebook.com/piacomvn"
              target="_blank"
              rel="noreferrer"
            >
              <FaFacebookF />
            </a>
            <a href="mailto:example@example.com">
              <MdMailOutline />
            </a>
            <a href="tel:0987654321">
              <FiPhone />
            </a>
            <a
              href="https://www.linkedin.com/company/piacompetrolimex/"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
        <div className="footer_solution">
          <h3>{t("footer.solutions")}</h3>
          <div className="footer_solution_content">
            <a href="https://piacom.vn/egas/">
              <p>{t("footer.solutionEgas")}</p>
            </a>
            <a href="https://piacom.vn/erp/">
              <p>{t("footer.solutionErp")}</p>
            </a>
            <a href="https://piacom.vn/kho/">
              <p>{t("footer.solutionTas")}</p>
            </a>
            <a href="https://piacom.vn/dich-vu-cntt/">
              <p>{t("footer.solutionInfra")}</p>
            </a>
          </div>
        </div>
        <div className="footer_about">
          <h3>{t("footer.about")}</h3>
          <div className="footer_about_content">
            <a href="https://piacom.vn/gioi-thieu/">
              <p>{t("footer.aboutPiacom")}</p>
            </a>
            <a href="https://piacom.vn/lien-he/">
              <p>{t("footer.contact")}</p>
            </a>
            <a href="https://piacom.vn/chinh-sach-bao-mat-thong-tin/">
              <p>{t("footer.privacy")}</p>
            </a>
            <a href="https://piacom.petrolimex.com.vn/">
              <p>{t("footer.disclosureWebsite")}</p>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
