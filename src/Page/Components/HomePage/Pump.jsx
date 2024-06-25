import { useEffect, useState } from "react";
import usePumpStore from "../../../store/pumpStore.js";
import useTankStore from "../../../store/tankStore.js";
import useProductStore from "../../../store/productStore.js";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Doughnut } from "react-chartjs-2";
import { TbEyeEdit } from "react-icons/tb";
import "chart.js/auto";
import "./Staff.css";
import Popup from '../Popup/Popup';

export const Pump = () => {
  const pumps = usePumpStore((state) => state.pumps);
  const fetchPump = usePumpStore((state) => state.fetchPump);
  const addPump = usePumpStore((state) => state.addPump);
  const modifyPump = usePumpStore((state) => state.modifyPump);
  const product = useProductStore((state) => state.product);
  const fetchProduct = useProductStore((state) => state.fetchProduct);

  const tanks = useTankStore((state) => state.tanks);
  const fetchTank = useTankStore((state) => state.fetchTank);

  const [selectedStaff, setSelectedStaff] = useState(null);
  const [addingStaff, setAddingStaff] = useState(false);
  const pumpId = Math.floor(100000 + Math.random() * 900000);

  const [viewMode, setViewMode] = useState("use");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [popup, setPopup] = useState({ show: false, title: '', message: '' });

  const [newStaff, setNewStaff] = useState({
    pid: "",
    pumpId: (pumpId),
    pumpCode: "",
    pumpName: "",
    pumpStatus: "On use",
    product: {
      productName: "",
      productCode: "",
    },
    tank: {
      tankName: "",
      tankCode: "",
    },
  });

  useEffect(() => {
    fetchPump();
  }, [fetchPump]);

  useEffect(() => {
    fetchTank();
  }, [fetchTank]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    if (product.length > 0) {
      setNewStaff((prevState) => ({
        ...prevState,
        product: {
          productName: product[0].productName,
          productCode: product[0].productCode,
        },
      }));
    }
  }, [product]);

  useEffect(() => {
    if (tanks.length > 0) {
      setNewStaff((prevState) => ({
        ...prevState,
        tank: {
          tankName: tanks[0].tankName,
          tankCode: tanks[0].tankCode,
        },
      }));
    }
  }, [tanks]);


  const handleEdit = (staffMember) => {
    setSelectedStaff(staffMember);
  };

  const saveChanges = async () => {
    if (selectedStaff) {
      try {
        await modifyPump(selectedStaff);
        setSelectedStaff(null);
      } catch (error) {
        console.error("Save error:", error);
      }
    }
  };

  const handleAddStaff = () => {
    if (!newStaff.pumpCode || !newStaff.pumpName) {
      setPopup({
        show: true,
        title: 'Lỗi',
        message: 'Vui lòng nhập đầy đủ thông tin nhân viên.',
      });
      return;
    }

    try {
      const result = addPump(newStaff);
      setNewStaff({
        pid: "",
        pumpId: (pumpId),
        pumpCode: "",
        pumpName: "",
        pumpStatus: "On use",
        product:
          product.length > 0
            ? {
                productName: product[0].productName,
                productCode: product[0].productCode,
              }
            : { productName: "", productCode: "" },
        tank:
          tanks.length > 0
            ? {
                tankName: tanks[0].tankName,
                tankCode: tanks[0].tankCode,
              }
            : { tankName: "", tankCode: "" },
      });
      setAddingStaff(false);
    } catch (error) {
      console.error("Add staff error:", error);
    }
  };

  const firstNumber = pumps.filter(
    (staffMember) => staffMember.pumpStatus === "On use"
  ).length;
  const secondNumber = pumps.filter(
    (staffMember) => staffMember.pumpStatus === "Not On use"
  ).length;

  const data = {
    labels: ["Red", "blue"],
    datasets: [
      {
        label: "VOI BƠM",
        data: [firstNumber, secondNumber],
        backgroundColor: ["Green","Red"],
        hoverOffset: 20,
      },
    ],
  };

  const workingStaff = pumps.filter(
    (staffMember) => staffMember.pumpStatus === "On use"
  );
  const notWorkingStaff = pumps.filter(
    (staffMember) => staffMember.pumpStatus === "Not On use"
  );

  const filteredStaff = (viewMode === "use" ? workingStaff : notWorkingStaff).filter(
    (staffMember) =>
      staffMember.pumpCode.toString().includes(searchQuery) ||
      staffMember.pumpName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastStaff = currentPage * perPage;
  const indexOfFirstStaff = indexOfLastStaff - perPage;
  const displayedStaff = filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff);

  const totalPages = Math.ceil(filteredStaff.length / perPage);

  const [showOverlay, setShowOverlay] = useState(true);
  
  const closePopup = () => {
    setPopup({ show: false, title: '', message: '' });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
        <p>THÔNG TIN VÒI BƠM</p>
        <div className="search-container">
          {/* <FaMagnifyingGlass className="search-icon" /> */}
          <input type="text" placeholder="Search..." className="search-input"
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
                    <option value="use">Đang kinh doanh</option>
                    <option value="noUse">Ngừng kinh doanh</option>
                  </select>
                </th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
            {displayedStaff.length > 0 ? (
              displayedStaff.map((staffMember, index) => (
                <tr key={staffMember.pumpCode} className="col" id="mainstate">
                  <td>{indexOfFirstStaff + index + 1}</td>
                  <td>{staffMember.pumpName} - {staffMember.pumpCode}</td>
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
                  {searchQuery ? "Không tìm thấy thông tin Vòi bơm." : "Chưa có thông tin vòi bơm."}
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
        {selectedStaff && (
          <>
            <div className="overlay" onClick={() => setSelectedStaff(null)}></div>
            <div className="viewStaff">
            <h2>VÒI BƠM</h2>
            <AiOutlineClose
              onClick={() => setSelectedStaff(null)}
              className="close-icon"
            />
            <input
              type="text"
              placeholder="Pump Name"
              value={selectedStaff.pumpName}
              onChange={(e) =>
                setSelectedStaff({ ...selectedStaff, pumpName: e.target.value })
              }
            />
            <br />
            <input type="text" placeholder="Pump Code" value={selectedStaff.pumpCode} readOnly />
            <br />
            <select
              value={selectedStaff.pumpStatus}
              onChange={(e) =>
                setSelectedStaff({
                  ...selectedStaff,
                  pumpStatus: e.target.value,
                })
              }
            >
              <option value="On use">On use</option>
              <option value="Not On use">Not On use</option>
            </select>

            <select
              value={selectedStaff.product.productCode}
              onChange={(e) => {
                const selectedProduct = product.find(
                  (p) => p.productCode === e.target.value
                );
                setSelectedStaff({
                  ...selectedStaff,
                  product: {
                    productCode: selectedProduct.productCode,
                    productName: selectedProduct.productName,
                  },
                });
              }}
            >
              <optgroup label="Mã Mặt Hàng - Tên Mặt Hàng">
                {product.map((product) => (
                  <option key={product.productCode} value={product.productCode}>
                    {product.productCode} - {product.productName}
                  </option>
                ))}
              </optgroup>
            </select>

            <select
              value={selectedStaff.tank.tankCode}
              onChange={(e) => {
                const selectedTank = tanks.find(
                  (t) => t.tankCode === e.target.value
                );
                setSelectedStaff({
                  ...selectedStaff,
                  tank: {
                    tankCode: selectedTank.tankCode,
                    tankName: selectedTank.tankName,
                  },
                });
              }}
            >
              <optgroup label="Tên Bể - Mã Bể">
                {tanks.map((tank) => (
                  <option key={tank.tankCode} value={tank.tankCode}>
                    {tank.tankName}
                  </option>
                ))}
              </optgroup>
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
            <h2>Thêm Vòi Bơm Mới</h2>
            <AiOutlineClose
              onClick={() => setAddingStaff(false)}
              className="close-icon"
            />
            <input
              type="text"
              placeholder="Pump Name"
              value={newStaff.pumpName}
              onChange={(e) =>
                setNewStaff({ ...newStaff, pumpName: e.target.value })
              }
            />
            <br/>
            <input
              type="text"
              placeholder="Pump Code"
              value={newStaff.pumpCode}
              onChange={(e) =>
                setNewStaff({ ...newStaff, pumpCode: e.target.value })
              }
            />
            <br />
            <select
              value={newStaff.pumpStatus}
              onChange={(e) =>
                setNewStaff({ ...newStaff, pumpStatus: e.target.value })
              }
            >
              <option value="On use">On use</option>
              <option value="Not On use">Not On use</option>
            </select>
            <select
              value={newStaff.product.productCode}
              onChange={(e) => {
                const selectedProduct = product.find(
                  (p) => p.productCode === e.target.value
                );
                setNewStaff({
                  ...newStaff,
                  product: {
                    productCode: selectedProduct.productCode,
                    productName: selectedProduct.productName,
                  },
                });
              }}
            >
              <optgroup label="Mã Mặt Hàng - Tên Mặt Hàng">
                {product.map((product) => (
                  <option key={product.productCode} value={product.productCode}>
                    {product.productCode} - {product.productName}
                  </option>
                ))}
              </optgroup>
            </select>
            <select
              value={newStaff.tank.tankCode}
              onChange={(e) => {
                const selectedTank = tanks.find(
                  (t) => t.tankCode === e.target.value
                );
                setNewStaff({
                  ...newStaff,
                  tank: {
                    tankCode: selectedTank.tankCode,
                    tankName: selectedTank.tankName,
                  },
                });
              }}
            >
              <optgroup label="Mã Bể - Tên Bể">
                {tanks.map((tank) => (
                  <option key={tank.tankCode} value={tank.tankCode}>
                    {tank.tankCode} - {tank.tankName}
                  </option>
                ))}
              </optgroup>
            </select>
            <button className="send" onClick={handleAddStaff}>
              THÊM
            </button>
          </div>
          </>
        )}
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
      {popup.show && <Popup title={popup.title} message={popup.message} onClose={closePopup} />}
    </div>
  );
};

export default Pump;