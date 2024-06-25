import React, { useEffect, useState } from "react";
import useStaffStore from "../../../store/staffStore.js";
import { AiOutlineClose } from "react-icons/ai";
import { TbEyeEdit } from "react-icons/tb";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import "./Staff.css";
import Popup from '../Popup/Popup';

export const Staff = () => {
  const staff = useStaffStore((state) => state.staff);
  const fetchStaff = useStaffStore((state) => state.fetchStaff);
  const addStaff = useStaffStore((state) => state.addStaff);
  const modifyStaff = useStaffStore((state) => state.modifyStaff);
  const [popup, setPopup] = useState({ show: false, title: '', message: '' });

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

  const saveChanges = async () => {
    if (selectedStaff) {
      try {
        var status = await modifyStaff(selectedStaff);
        setSelectedStaff(null);
      } catch (error) {
        console.error("Save error:", error);
      }
    }
  };

  const handleAddStaff = () => {
    if (!newStaff.fullName || !newStaff.email || !newStaff.phoneNum) {
      setPopup({
        show: true,
        title: 'Lỗi',
        message: 'Vui lòng nhập đầy đủ thông tin nhân viên.',
      });
      return;
    }
  
    try {
      var result = addStaff(newStaff);
      if (result.Status === 'error') {
        setPopup({ show: true, title: result.Title, message: result.Message });
      }
      setNewStaff({
        fullName: "",
        email: "",
        phoneNum: "",
        workingStatus: "IS WORKING",
      });
      setAddingStaff(false);
    } catch (error) {
      console.error("Add staff error:", error);
    }
  };

  const firstNumber = staff.filter((staffMember) => staffMember.workingStatus === "IS WORKING").length;
  const secondNumber = staff.filter((staffMember) => staffMember.workingStatus === "ISN'T WORKING").length;

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

  const filteredStaff = (viewMode === "working" ? workingStaff : notWorkingStaff).filter(
    (staffMember) =>
      staffMember.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staffMember.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastStaff = currentPage * perPage;
  const indexOfFirstStaff = indexOfLastStaff - perPage;
  const displayedStaff = filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff);

  const totalPages = Math.ceil(filteredStaff.length / perPage);

  const closePopup = () => {
    setPopup({ show: false, title: '', message: '' });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [showOverlay, setShowOverlay] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="Staff">
      {showOverlay && 
       <div className="overlay">
        <div class="loader">
          <svg class="circular" viewBox="25 25 50 50">
            <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
          </svg>
        </div>
      </div>}
      <header>
        <p>THÔNG TIN NHÂN VIÊN</p>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
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
                <th>STT</th>
                <th>
                  <select onChange={(e) => setViewMode(e.target.value)} value={viewMode}>
                    <option value="working">Đang làm việc</option>
                    <option value="notWorking">Ngừng làm việc</option>
                  </select>
                </th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {displayedStaff.length > 0 ? (
                displayedStaff.map((staffMember, index) => (
                  <tr key={staffMember.staffId} className="col" id="mainstate">
                    <td>{indexOfFirstStaff + index + 1}</td>
                    <td>{staffMember.fullName} - {staffMember.email}</td>
                    <td className="icon_editview">
                      <TbEyeEdit className="icon_menu"
                        onClick={() => handleEdit(staffMember)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-data">
                    {searchQuery ? "Không tìm thấy thông tin nhân viên." : "Chưa có thông tin nhân viên."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {displayedStaff.length > 0 && (
            <div className="pagination">
              <p>
                <span>Showing &nbsp;</span> <span>{indexOfFirstStaff + 1}&nbsp;</span><span>to&nbsp;</span><span>{Math.min(indexOfLastStaff, filteredStaff.length)}&nbsp;</span> <span>of&nbsp;</span> <span>{filteredStaff.length}&nbsp;</span> entries
              </p>
              <ul className="pagination-list">
                <li className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                </li>
                {Array.from({ length: totalPages }, (_, index) => (
                  <li key={index} className={`pagination-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
                  </li>
                ))}
                <li className={`pagination-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                </li>
              </ul>
            </div>
          )}
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
                  text: "",
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
              <input
                type="text"
                placeholder="Full Name"
                value={selectedStaff.fullName}
                onChange={(e) =>
                  setSelectedStaff({ ...selectedStaff, fullName: e.target.value })
                }
              />
              <br />
              <input placeholder="Email" type="text" value={selectedStaff.email} readOnly />
              <br />
              <input
                type="text"
                placeholder="Phone Number"
                value={selectedStaff.phoneNum}
                onChange={(e) =>
                  setSelectedStaff({ ...selectedStaff, phoneNum: e.target.value })
                }
              />
              <br />
              <select
                value={selectedStaff.workingStatus}
                onChange={(e) =>
                  setSelectedStaff({
                    ...selectedStaff,
                    workingStatus: e.target.value,
                  })
                }
              >
                <option value="IS WORKING">IS WORKING</option>
                <option value="ISN'T WORKING">ISN'T WORKING</option>
              </select>
              <button className="send" onClick={saveChanges}>
                OK
              </button>
            </div>
          </>
        )}
        {addingStaff && (
          <>
            <div className="overlay" onClick={() => setAddingStaff(false)}></div>
            <div className="addStaff">
              <h2>Thêm Nhân Viên Mới</h2>
              <AiOutlineClose
                onClick={() => setAddingStaff(false)}
                className="close-icon"
              />
              <input
                type="text"
                placeholder="Full Name"
                value={newStaff.fullName}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, fullName: e.target.value })
                }
              />
              <br />
              <input
                type="text"
                placeholder="Email"
                value={newStaff.email}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, email: e.target.value })
                }
              />
              <br />
              <input
                type="text"
                placeholder="Phone Number"
                value={newStaff.phoneNum}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, phoneNum: e.target.value })
                }
              />
              <br />
              <select
                value={newStaff.workingStatus}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, workingStatus: e.target.value })
                }
              >
                <option value="IS WORKING">IS WORKING</option>
                <option value="ISN'T WORKING">ISN'T WORKING</option>
              </select>
              <button className="send" onClick={handleAddStaff}>
                THÊM
              </button>
            </div>
          </>
        )}
        
      {popup.show && <Popup title={popup.title} message={popup.message} onClose={closePopup} />}
    </div>
  );
};

export default Staff;
