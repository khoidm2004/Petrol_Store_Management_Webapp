import { useEffect, useState } from "react";
import useStaffStore from "../../../store/staffStore.js";
import { AiOutlineClose } from "react-icons/ai";
import { TbEyeEdit } from "react-icons/tb";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import "./staff.css";
import Popup from "../Popup/Popup.jsx";

const Staff = () => {
  const staff = useStaffStore((state) => state.staff);
  const fetchStaff = useStaffStore((state) => state.fetchStaff);
  const addStaff = useStaffStore((state) => state.addStaff);
  const modifyStaff = useStaffStore((state) => state.modifyStaff);
  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
    status: "",
  });

  const [selectedStaff, setSelectedStaff] = useState(null);
  const [addingStaff, setAddingStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({
    staffId: "",
    fullName: "",
    email: "",
    phoneNum: "",
    workingStatus: "IS WORKING",
  });

  const [viewMode, setViewMode] = useState("working");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleEdit = (staffMember) => {
    setSelectedStaff(staffMember);
  };

  const validateEmail = (email) => {
    const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!basicEmailRegex.test(String(email).toLowerCase())) {
      return false;
    }
    const domainPart = email.split("@")[1];
    const noNumberAfterAtRegex = /^[^\d]+$/;
    if (!noNumberAfterAtRegex.test(domainPart)) {
      return false;
    }
    const validDomainRegex = /^[^\s@]+@(gmail\.com|outlook\.com)$/;
    if (!validDomainRegex.test(String(email).toLowerCase())) {
      return false;
    }

    return true;
  };

  const validatePhoneNumber = (phoneNum) => {
    const re = /^(?:\+84|0|84|0084)\d{9}$/;
    return re.test(String(phoneNum));
  };

  const saveChanges = async () => {
    if (
      !selectedStaff.fullName ||
      !selectedStaff.email ||
      !selectedStaff.phoneNum
    ) {
      setPopup({
        show: true,
        title: "Thông báo",
        message: "Vui lòng nhập đầy đủ thông tin nhân viên.",
        status: "warning",
      });
      return;
    }

    if (!validatePhoneNumber(selectedStaff.phoneNum)) {
      setPopup({
        show: true,
        title: "Thông báo",
        message: "Vui lòng nhập số điện thoại gồm 10 chữ số.",
        status: "warning",
      });
      return;
    }

    try {
      var status = await modifyStaff(selectedStaff);
      setSelectedStaff(null);
      setPopup({
        show: true,
        title: "Thông báo",
        message: status.Message,
        status: status.Status,
      });
    } catch (error) {
      setPopup({
        show: true,
        title: "Lỗi",
        message: error.Message,
        status: error,
      });
    }
  };

  const handleAddStaff = async () => {
    if (!newStaff.fullName || !newStaff.email || !newStaff.phoneNum) {
      setPopup({
        show: true,
        title: "Thông báo",
        message: "Vui lòng nhập đầy đủ thông tin nhân viên.",
        status: "warning",
      });
      return;
    }

    if (!validateEmail(newStaff.email)) {
      setPopup({
        show: true,
        title: "Thông báo",
        message: "Vui lòng nhập đúng định dạng email.",
        status: "warning",
      });
      return;
    }

    if (!validatePhoneNumber(newStaff.phoneNum)) {
      setPopup({
        show: true,
        title: "Thông báo",
        message: "Vui lòng nhập số điện thoại gồm 10 chữ số.",
        status: "warning",
      });
      return;
    }

    try {
      var result = await addStaff(newStaff);
      setPopup({
        show: true,
        title: result.Title,
        message: result.Message,
        status: result.Status,
      });
      setNewStaff({
        fullName: "",
        email: "",
        phoneNum: "",
        workingStatus: "IS WORKING",
      });
      setAddingStaff(false);
    } catch (error) {
      setPopup({
        show: true,
        title: "Lỗi",
        message: error.Message,
        status: error,
      });
    }
  };

  const firstNumber = staff.filter(
    (staffMember) => staffMember.workingStatus === "IS WORKING"
  ).length;
  const secondNumber = staff.filter(
    (staffMember) => staffMember.workingStatus === "ISN'T WORKING"
  ).length;

  const data = {
    labels: ["Đang làm việc", "Đã nghỉ việc "],
    datasets: [
      {
        label: "NHÂN VIÊN",
        data: [firstNumber, secondNumber],
        backgroundColor: ["GREEN", "RED"],
        hoverOffset: 10,
      },
    ],
  };

  const workingStaff = staff.filter(
    (staffMember) => staffMember.workingStatus === "IS WORKING"
  );
  const notWorkingStaff = staff.filter(
    (staffMember) => staffMember.workingStatus === "ISN'T WORKING"
  );

  const filteredStaff = (
    viewMode === "working" ? workingStaff : notWorkingStaff
  ).filter(
    (staffMember) =>
      staffMember.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staffMember.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (searchQuery !== "" && currentPage !== 1) {
    setCurrentPage(1);
  }

  const indexOfLastStaff = currentPage * perPage;
  const indexOfFirstStaff = indexOfLastStaff - perPage;
  const displayedStaff = filteredStaff.slice(
    indexOfFirstStaff,
    indexOfLastStaff
  );

  const totalPages = Math.ceil(filteredStaff.length / perPage);

  const closePopup = () => {
    setPopup({ show: false, title: "", message: "", status: "" });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="revenue">
      <header className="header_staff">
        <p>THÔNG TIN NHÂN VIÊN</p>
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="push"
          onClick={() => setAddingStaff(true)}
        >
          THÊM
        </button>
      </header>
      <div className="Staffs">
        <div className="box_staff">
          <table className="firsttable">
            <thead>
              <tr className="titleOneline">
                <th className="center_sum">STT</th>
                <th>
                  <select
                    onChange={(e) => setViewMode(e.target.value)}
                    value={viewMode}
                  >
                    <option value="working">Đang làm việc</option>
                    <option value="notWorking">Đã nghỉ việc</option>
                  </select>
                </th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {displayedStaff.length > 0 ? (
                displayedStaff.map((staffMember, index) => (
                  <tr key={staffMember.staffId} className="col" id="mainstate">
                    <td className="center_sum">
                      {indexOfFirstStaff + index + 1}
                    </td>
                    <td>
                      {staffMember.fullName} - {staffMember.email}
                    </td>
                    <td className="icon_editview">
                      <TbEyeEdit
                        className="icon_menu"
                        onClick={() => handleEdit(staffMember)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="center_sum">
                    {searchQuery
                      ? "Không tìm thấy thông tin nhân viên."
                      : "Chưa có thông tin nhân viên."}
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan="3">
                  {displayedStaff.length > 0 && (
                    <div className="pagination">
                      <p>
                        <span>
                          Đang hiển thị {indexOfFirstStaff + 1} đến{" "}
                          {Math.min(indexOfLastStaff, filteredStaff.length)}{" "}
                          trên {filteredStaff.length} nhân viên{" "}
                        </span>
                      </p>
                      <ul className="pagination-list">
                        <li
                          className={`pagination-item ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Trước
                          </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, index) => (
                          <li
                            key={index}
                            className={`pagination-item ${
                              currentPage === index + 1 ? "active" : ""
                            }`}
                          >
                            <button onClick={() => handlePageChange(index + 1)}>
                              {index + 1}
                            </button>
                          </li>
                        ))}
                        <li
                          className={`pagination-item ${
                            currentPage === totalPages ? "disabled" : ""
                          }`}
                        >
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Sau
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="chart-container">
          <Doughnut
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: "NHÂN VIÊN",
                },
                datalabels: {
                  display: false,
                },
              },
            }}
          />
        </div>
      </div>
      {selectedStaff && (
        <>
          <div className="overlay" onClick={() => setSelectedStaff(null)}></div>
          <div className="viewStaff">
            <h2>NHÂN VIÊN</h2>
            <AiOutlineClose
              onClick={() => setSelectedStaff(null)}
              className="close-icon"
            />
            <label>
              Tên
              <input
                type="text"
                value={selectedStaff.fullName}
                onChange={(e) =>
                  setSelectedStaff({
                    ...selectedStaff,
                    fullName: e.target.value,
                  })
                }
              />
            </label>
            <br />
            <label>
              Email
              <input type="text" value={selectedStaff.email} readOnly />
            </label>
            <br />
            <label>
              Số điện thoại
              <input
                type="text"
                value={selectedStaff.phoneNum}
                onChange={(e) =>
                  setSelectedStaff({
                    ...selectedStaff,
                    phoneNum: e.target.value,
                  })
                }
              />
            </label>
            <br />
            <label>
              Trạng thái
              <select
                value={selectedStaff.workingStatus}
                onChange={(e) =>
                  setSelectedStaff({
                    ...selectedStaff,
                    workingStatus: e.target.value,
                  })
                }
              >
                <option value="IS WORKING">Đang làm việc</option>
                <option value="ISN'T WORKING">Đã nghỉ việc</option>
              </select>
            </label>
            <br />
            <button type="button" onClick={saveChanges}>
              Lưu
            </button>
          </div>
        </>
      )}

      {addingStaff && (
        <>
          <div className="overlay" onClick={() => setAddingStaff(false)}></div>
          <div className="addStaff">
            <h2>Thêm nhân viên mới</h2>
            <AiOutlineClose
              onClick={() => setAddingStaff(false)}
              className="close-icon"
            />
            <label>
              Tên
              <input
                type="text"
                value={newStaff.fullName}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, fullName: e.target.value })
                }
              />
            </label>
            <br />
            <label>
              Email
              <input
                type="text"
                value={newStaff.email}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, email: e.target.value })
                }
              />
            </label>
            <br />
            <label>
              Số điện thoại
              <input
                type="text"
                value={newStaff.phoneNum}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, phoneNum: e.target.value })
                }
              />
            </label>
            <br />
            <button type="button" onClick={handleAddStaff}>
              Thêm
            </button>
          </div>
        </>
      )}
      {popup.show && (
        <Popup
          title={popup.title}
          message={popup.message}
          status={popup.status}
          onClose={closePopup}
        />
      )}
    </div>
  );
};
export default Staff;
