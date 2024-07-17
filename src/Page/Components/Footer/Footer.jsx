import "./Footer.css";
import { FaFacebookF } from "react-icons/fa";
import { MdMailOutline } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <div className="footer_container">
        <div className="footer_info">
          <h1>PIACOM</h1>
          <h4>Công ty Cổ phần Tin học Viễn thông Petrolimex</h4>
          <div className="footer_info_email">
            <p>
              <span>Email:</span> info.piacom@petrolimex.com.vn
            </p>
          </div>
          <div className="footer_info_content">
            <p>
              <span>Văn phòng giao dịch:</span> Tầng 15, tòa nhà Detech, 8c Tôn
              Thất Thuyết, quận Nam Từ Liêm, Hà Nội
            </p>
            <p>
              <span>CN Miền Nam: </span> Tầng 6, tòa nhà WIN HOME, 209 Hoàng Văn
              Thụ, quận Phú Nhuận, TP. Hồ Chí Minh
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
          <h3>Giải pháp</h3>
          <div className="footer_solution_content">
            <a href="https://piacom.vn/egas/">
              <p>Giải pháp quản lý cửa hàng xăng dầu – EGAS</p>
            </a>
            <a href="https://piacom.vn/erp/">
              <p>Giải pháp quản trị nguồn lực doanh nghiệp xăng dầu – ERP</p>
            </a>
            <a href="https://piacom.vn/kho/">
              <p>Giải pháp quản lý kho xăng dầu – TAS</p>
            </a>
            <a href="https://piacom.vn/dich-vu-cntt/">
              <p>Dịch vụ hạ tầng mạng và trung tâm dữ liệu</p>
            </a>
          </div>
        </div>
        <div className="footer_about">
          <h3>Về PIACOM</h3>
          <div className="footer_about_content">
            <a href="https://piacom.vn/gioi-thieu/">
              <p>Giới thiệu về PIACOM</p>
            </a>
            <a href="https://piacom.vn/lien-he/">
              <p>Liên hệ</p>
            </a>
            <a href="https://piacom.vn/chinh-sach-bao-mat-thong-tin/">
              <p>Chính sách bảo mật thông tin</p>
            </a>
            <a href="https://piacom.petrolimex.com.vn/">
              <p>Website công bố thông tin</p>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
