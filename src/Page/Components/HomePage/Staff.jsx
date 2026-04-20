import { useEffect, useState, useMemo } from "react";
import useStaffStore from "../../../store/staffStore.js";
import { AiOutlineClose } from "react-icons/ai";
import { TbEyeEdit } from "react-icons/tb";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import "./staff.css";
import Popup from "../Popup/Popup.jsx";
import { useTranslation } from "react-i18next";

const Staff = () => {
  const { t } = useTranslation();
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
        title: t("common.notification"),
        message: t("messages.staffEnterFull"),
        status: "warning",
      });
      return;
    }

    if (!validatePhoneNumber(selectedStaff.phoneNum)) {
      setPopup({
        show: true,
        title: t("common.notification"),
        message: t("messages.staffPhone10"),
        status: "warning",
      });
      return;
    }

    try {
      var status = await modifyStaff(selectedStaff);
      setSelectedStaff(null);
      setPopup({
        show: true,
        title: t("common.notification"),
        message: status.Message,
        status: status.Status,
      });
    } catch (error) {
      setPopup({
        show: true,
        title: t("common.error"),
        message: error.Message,
        status: error,
      });
    }
  };

  const handleAddStaff = async () => {
    if (!newStaff.fullName || !newStaff.email || !newStaff.phoneNum) {
      setPopup({
        show: true,
        title: t("common.notification"),
        message: t("messages.staffEnterFull"),
        status: "warning",
      });
      return;
    }

    if (!validateEmail(newStaff.email)) {
      setPopup({
        show: true,
        title: t("common.notification"),
        message: t("messages.emailInvalid"),
        status: "warning",
      });
      return;
    }

    if (!validatePhoneNumber(newStaff.phoneNum)) {
      setPopup({
        show: true,
        title: t("common.notification"),
        message: t("messages.staffPhone10"),
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
        title: t("common.error"),
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

  const data = useMemo(
    () => ({
      labels: [t("messages.working"), t("messages.notWorking")],
      datasets: [
        {
          label: t("charts.staff"),
          data: [firstNumber, secondNumber],
          backgroundColor: ["GREEN", "RED"],
          hoverOffset: 10,
        },
      ],
    }),
    [firstNumber, secondNumber, t]
  );

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
        <p>{t("pages.staffInfo")}</p>
        <div className="search-container">
          <input
            type="text"
            placeholder={t("common.search")}
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
          {t("common.add")}
        </button>
      </header>
      <div className="Staffs">
        <div className="box_staff">
          <table className="firsttable">
            <thead>
              <tr className="titleOneline">
                <th className="center_sum">{t("tables.stt")}</th>
                <th>
                  <select
                    onChange={(e) => setViewMode(e.target.value)}
                    value={viewMode}
                  >
                    <option value="working">{t("messages.working")}</option>
                    <option value="notWorking">{t("messages.notWorking")}</option>
                  </select>
                </th>
                <th>{t("tables.detail")}</th>
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
                      ? t("messages.staffNotFound")
                      : t("messages.staffEmpty")}
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan="3">
                  {displayedStaff.length > 0 && (
                    <div className="pagination">
                      <p>
                        <span>
                          {t("pagination.staffList", {
                            from: indexOfFirstStaff + 1,
                            to: Math.min(indexOfLastStaff, filteredStaff.length),
                            total: filteredStaff.length,
                          })}
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
                            {t("common.previous")}
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
                            {t("common.next")}
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
                  text: t("charts.staff"),
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
            <h2>{t("charts.staff")}</h2>
            <AiOutlineClose
              onClick={() => setSelectedStaff(null)}
              className="close-icon"
            />
            <label>
              {t("tables.name")}
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
              {t("tables.email")}
              <input type="text" value={selectedStaff.email} readOnly />
            </label>
            <br />
            <label>
              {t("tables.phone")}
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
              {t("tables.status")}
              <select
                value={selectedStaff.workingStatus}
                onChange={(e) =>
                  setSelectedStaff({
                    ...selectedStaff,
                    workingStatus: e.target.value,
                  })
                }
              >
                <option value="IS WORKING">{t("messages.working")}</option>
                <option value="ISN'T WORKING">{t("messages.notWorking")}</option>
              </select>
            </label>
            <br />
            <button type="button" onClick={saveChanges}>
              {t("common.save")}
            </button>
          </div>
        </>
      )}

      {addingStaff && (
        <>
          <div className="overlay" onClick={() => setAddingStaff(false)}></div>
          <div className="addStaff">
            <h2>{t("messages.newStaffTitle")}</h2>
            <AiOutlineClose
              onClick={() => setAddingStaff(false)}
              className="close-icon"
            />
            <label>
              {t("tables.name")}
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
              {t("tables.email")}
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
              {t("tables.phone")}
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
              {t("messages.addButton")}
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
