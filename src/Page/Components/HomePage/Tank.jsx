import { useEffect, useState } from "react";
import useTankStore from "../../../store/tankStore.js";
import useProductStore from "../../../store/productStore.js";
import { AiOutlineClose } from "react-icons/ai";
import { Doughnut } from "react-chartjs-2";
import { TbEyeEdit } from "react-icons/tb";
import "chart.js/auto";
import "./Staff.css";
import Popup from '../Popup/Popup';

export const Tank = () => {
  const tanks = useTankStore((state) => state.tanks);
  const fetchTank = useTankStore((state) => state.fetchTank);
  const addTank = useTankStore((state) => state.addTank);
  const modifyTank = useTankStore((state) => state.modifyTank);
  const [popup, setPopup] = useState({ show: false, title: '', message: '' });

  const product = useProductStore((state) => state.product); 
  const fetchProduct = useProductStore((state) => state.fetchProduct);

  const [selectedTank, setSelectedTank] = useState(null);
  const [addingTank, setAddingTank] = useState(false);
  const tankId = Math.floor(100000 + Math.random() * 900000);
  const quantity_left = Math.floor(100 + Math.random() * 9);

  const [viewMode, setViewMode] = useState("use");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const [newTank, setNewTank] = useState({
    tid: "",
    tankId: (tankId),
    tankCode: 0,
    tankName: "",
    tankStatus: "ON USE",
    product: {
      productName: "",
      productCode: "",
      quantity_left: (quantity_left),
    },
  });

  useEffect(() => {
    fetchTank();
    fetchProduct();
  }, [fetchTank, fetchProduct]);

  useEffect(() => {
    if (product.length > 0) {
      setNewTank({
        ...newTank,
        product: {
          productName: product[0].productName,
          productCode: product[0].productCode,
          quantity_left: (quantity_left),
        },
      });
    }
  }, [product]);


  const handleEdit = (TankMember) => {
    setSelectedTank(TankMember);
  };

  const saveChanges = async () => {
    if (selectedTank) {
      try {
        console.log(selectedTank);
        await modifyTank(selectedTank);
        setSelectedTank(null);
      } catch (error) {
        console.error("Save error:", error);
      }
    }
  };

  const handleAddTank = () => {
    if (!newTank.tankName || !newTank.tankCode || !newTank.tankVolume) {
      setPopup({
        show: true,
        title: 'Lỗi',
        message: 'Vui lòng nhập đầy đủ thông tin nhân viên.',
      });
      return;
    }
    try {
      const result = addTank(newTank);
      setNewTank({
        tid: "",
        tankId:(tankId),
        tankCode: 0,
        tankName: "",
        tankStatus: "ON USE",
        product:
          product.length > 0
            ? {
                productName: product[0].productName,
                productCode: product[0].productCode,
                quantity_left: (quantity_left),
              }
            : { productName: "", productCode: "" , quantity_left: (quantity_left)},
      });
      setAddingTank(false);
    } catch (error) {
      console.error("Add Tank error:", error);
    }
  };

  const firstNumber = tanks.filter(
    (TankMember) => TankMember.tankStatus === "ON USE"
  ).length;
  const secondNumber = tanks.filter(
    (TankMember) => TankMember.tankStatus === "NOT ON USE"
  ).length;

  const data = {
    labels: ["Đang kinh doanh", "Ngừng kinh doanh"],
    datasets: [
      {
        label: "Bể",
        data: [firstNumber, secondNumber],
        backgroundColor: ["Green", "Red"],
        hoverOffset: 10,
      },
    ],
  };

  const workingTank = tanks.filter(TankMember => TankMember.tankStatus === "ON USE");
  const notWorkingTank = tanks.filter(TankMember => TankMember.tankStatus === "NOT ON USE");

  const filteredStaff = (viewMode === "use" ? workingTank : notWorkingTank).filter(
    (TankMember) =>
      TankMember.tankCode.toString().includes(searchQuery) ||
      TankMember.tankName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastStaff = currentPage * perPage;
  const indexOfFirstStaff = indexOfLastStaff - perPage;
  const displayedStaff = filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff);

  const totalPages = Math.ceil(filteredStaff.length / perPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const closePopup = () => {
    setPopup({ show: false, title: '', message: '' });
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
        <p>THÔNG TIN BỂ</p>
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
          onClick={() => setAddingTank(true)}
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
                    <option value="notUse">Ngừng kinh doanh</option>
                  </select>
                </th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
            {displayedStaff.length > 0 ? (
              displayedStaff.map((TankMember, index) => (
                <tr key={TankMember.tankCode} className="col" id="mainstate">
                  <td>{indexOfFirstStaff + index + 1}</td>
                  <td>{TankMember.tankName} - {TankMember.tankCode}</td>
                  <td className="icon_editview">
                    <TbEyeEdit className="icon_menu"
                      onClick={() => handleEdit(TankMember)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">
                  {searchQuery ? "Không tìm thấy thông tin bể." : "Chưa có thông tin bể."}
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
        {selectedTank && (
          <>  
            <div className="overlay" onClick={() => setSelectedTank(null)}></div>
            <div className="viewStaff">
            <h2>Bể</h2>
            <AiOutlineClose
              onClick={() => setSelectedTank(null)}
              className="close-icon"
            />
            <input
              type="text"
              placeholder="Tank Name"
              value={selectedTank.tankName}
              onChange={(e) =>
                setSelectedTank({ ...selectedTank, tankName: e.target.value })
              }
            />
            <br />
            <input type="text" placeholder="Tank Code" value={parseInt(selectedTank.tankCode)} readOnly />
            <br />
            <input
              type="text"
              placeholder="Tank Volume"
              value={parseInt(selectedTank.tankVolume)}
              onChange={(e) =>
                setSelectedTank({ ...selectedTank, tankVolume: parseInt(e.target.value) })
              }
            />
            <br />
            <select
              value={selectedTank.tankStatus}
              onChange={(e) =>
                setSelectedTank({ ...selectedTank, tankStatus: e.target.value })
              }
            ><optgroup label="Hoạt động">
              <option value="ON USE">Đang kinh doanh</option>
              <option value="NOT ON USE">Ngừng kinh doanh</option>
            </optgroup>
            </select>
            <select
              value={selectedTank.product.productCode}
              onChange={(e) => {
                const selectedProduct = product.find(
                  (p) => p.productCode === e.target.value
                );
                setSelectedTank({
                  ...selectedTank,
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
              <button className="send" onClick={saveChanges}>
                OK
              </button>
          </div>
          </>
        )}
        {addingTank && (
          <>  
            <div className="overlay" onClick={() => setAddingTank(false)}></div>
            <div className="addStaff">
            <h2>Thêm Bể Mới</h2>
            <AiOutlineClose
              onClick={() => setAddingTank(false)}
              className="close-icon"
            />
            <input
              type="text"
              placeholder="Tank Name"
              value={newTank.tankName}
              onChange={(e) =>
                setNewTank({ ...newTank, tankName: e.target.value })
              }
            />
            <br />
            <input
              type="text"
              placeholder="Tank Code"
              onChange={(e) =>
                setNewTank({ ...newTank, tankCode: parseInt(e.target.value) })
              }
            />
            <br />
            <input
              type="text"
              placeholder="Tank Volume"
              onChange={(e) =>
                setNewTank({ ...newTank, tankVolume: parseInt(e.target.value) })
              }
            />
            <br />
            <select
              value={newTank.tankStatus}
              onChange={(e) =>
                setNewTank({ ...newTank, tankStatus: e.target.value })
              }
            ><optgroup label="Hoạt động">
                <option value="ON USE">Đang kinh doanh</option>
                <option value="NOT ON USE">Ngừng kinh doanh</option>
            </optgroup>
            </select>
            <select
              onChange={(e) => {
                const selectedProduct = product.find(
                  (p) => p.productCode === e.target.value
                );
                setNewTank({
                  ...newTank,
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
            <button className="send" onClick={handleAddTank}>
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

export default Tank;
