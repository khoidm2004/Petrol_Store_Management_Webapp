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
import "./staff.css";
import Popup from "../Popup/Popup";

export const Pump = () => {
  const pumps = usePumpStore((state) => state.pumps);
  const fetchPump = usePumpStore((state) => state.fetchPump);
  const addPump = usePumpStore((state) => state.addPump);
  const modifyPump = usePumpStore((state) => state.modifyPump);
  const product = useProductStore((state) => state.product);
  const fetchProduct = useProductStore((state) => state.fetchProduct);

  const tanks = useTankStore((state) => state.tanks);
  const fetchTank = useTankStore((state) => state.fetchTank);

  const [selectedPump, setSelectedPump] = useState(null);
  const [addingStaff, setAddingStaff] = useState(false);
  const pumpId = Math.floor(100000 + Math.random() * 900000);

  const [viewMode, setViewMode] = useState("fullUse");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [popup, setPopup] = useState({ show: false, title: "", message: "" });

  const [newStaff, setNewStaff] = useState({
    pid: "",
    pumpId: pumpId,
    pumpCode: 0,
    pumpName: "",
    pumpStatus: "ON USE",
    product: {
      productName: "",
      productCode: 0,
    },
    tank: {
      tankName: "",
      tankCode: 0,
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
          productCode: parseInt(product[0].productCode),
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
          tankCode: parseInt(tanks[0].tankCode),
        },
      }));
    }
  }, [tanks]);

  const handleEdit = (staffMember) => {
    setSelectedPump(staffMember);
  };

  
  const dataPump_product = tanks.map(tank => ({
    tankCode: tank.tankCode,
    productCode: parseInt(tank.product.productCode)
  }));

  const saveChanges = async () => {
    if (selectedPump) {
      try {
        if (!selectedPump.pumpCode || !selectedPump.pumpName) {
          setPopup({
            show: true,
            title: "Lỗi",
            message: "Vui lòng nhập đầy đủ và đúng thông tin nhân viên.",
          });
          return;
        }

        const isMatched = dataPump_product.some(tank => 
          parseInt(tank.tankCode) === parseInt(selectedPump.tank.tankCode) && parseInt(tank.productCode) === parseInt(selectedPump.product.productCode)
        );
      
        if (!isMatched) {
          setPopup({
            show: true,
            title: "Lỗi",
            message: "Không tìm thấy cặp Bể và Mặt Hàng tương ứng.",
          });
          return;
        }
        
        await modifyPump(selectedPump);
        setSelectedPump(null);
      } catch (error) {
        console.error("Save error:", error);
      }
    }
  };

  const handleAddStaff = async () => {
    if (!newStaff.pumpCode || !newStaff.pumpName) {
      setPopup({
        show: true,
        title: "Lỗi",
        message: "Vui lòng nhập đầy đủ và đúng thông tin nhân viên.",
      });
      return;
    }

    const isMatched = dataPump_product.some(tank => 
      parseInt(tank.tankCode) === parseInt(newStaff.tank.tankCode) && parseInt(tank.productCode) === parseInt(newStaff.product.productCode)
    );
  
    if (!isMatched) {
      setPopup({
        show: true,
        title: "Lỗi",
        message: "Không tìm thấy cặp Bể và Mặt Hàng tương ứng.",
      });
      return;
    }


    try {
      const result = await addPump(newStaff);
      setPopup({
        show: true,
        title: 'Thông báo',
        message: result.Message,
      });
      setNewStaff({
        pid: "",
        pumpId: pumpId,
        pumpCode: 0,
        pumpName: "",
        pumpStatus: "ON USE",
        product:
          product.length > 0
            ? {
                productName: product[0].productName,
                productCode: parseInt(product[0].productCode),
              }
            : { productName: "", productCode: 0 },
        tank:
          tanks.length > 0
            ? {
                tankName: tanks[0].tankName,
                tankCode: parseInt(tanks[0].tankCode),
              }
            : { tankName: "", tankCode: 0 },
      });
      setAddingStaff(false);
    } catch (error) {
      console.error("Add staff error:", error);
    }
  };

  const firstNumber = pumps.filter(
    (staffMember) => staffMember.pumpStatus === "ON USE"
  ).length;
  const secondNumber = pumps.filter(
    (staffMember) => staffMember.pumpStatus === "NOT ON USE"
  ).length;

  const data = {
    labels: ["Đang kinh doanh", "Ngừng kinh doanh"],
    datasets: [
      {
        label: "VOI BƠM",
        data: [firstNumber, secondNumber],
        backgroundColor: ["Green", "Red"],
        hoverOffset: 20,
      },
    ],
  };

  const workingStaff = pumps.filter(
    (staffMember) => staffMember.pumpStatus === "ON USE"
  );
  const notWorkingStaff = pumps.filter(
    (staffMember) => staffMember.pumpStatus === "NOT ON USE"
  );

  const filteredStaff = (viewMode === "fullUse"
    ? pumps
    : viewMode === "use"
    ? workingStaff
    : notWorkingStaff
  ).filter(
    (staffMember) =>
      staffMember.pumpCode.toString().includes(searchQuery) ||
      staffMember.pumpName.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    return a.pumpCode - b.pumpCode;
  });

  const indexOfLastStaff = currentPage * perPage;
  const indexOfFirstStaff = indexOfLastStaff - perPage;
  const displayedStaff = filteredStaff.slice(
    indexOfFirstStaff,
    indexOfLastStaff
  );

  const totalPages = Math.ceil(filteredStaff.length / perPage);

  const [showOverlay, setShowOverlay] = useState(true);

  const closePopup = () => {
    setPopup({ show: false, title: "", message: "" });
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
    <div className="revenue">
      {showOverlay && (
        <div className="overlay">
          <div class="loader">
            <svg class="circular" viewBox="25 25 50 50">
              <circle
                class="path"
                cx="50"
                cy="50"
                r="20"
                fill="none"
                stroke-width="2"
                stroke-miterlimit="10"
              />
            </svg>
          </div>
        </div>
      )}
      <header className="header_staff">
        <p>THÔNG TIN VÒI BƠM</p>
        <div className="search-container">
          {/* <FaMagnifyingGlass className="search-icon" /> */}
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
                  <select
                    onChange={(e) => setViewMode(e.target.value)}
                    value={viewMode}
                  >
                      <option value="fullUse">Tất cả vòi bơm</option>
                      <option value="use">Đang sử dụng</option>
                      <option value="noUse">Ngừng sử dụng</option>
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
                    <td>
                      {staffMember.pumpCode} - {staffMember.pumpName}
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
                  <td colSpan="3" className="no-data">
                    {searchQuery
                      ? "Không tìm thấy thông tin Vòi bơm."
                      : "Chưa có thông tin vòi bơm."}
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan="3" className="noLine">
                {displayedStaff.length > 0 && (
                  <div className="pagination">
                    <p>
                      <span>Đang hiển thị {indexOfFirstStaff + 1} đến {Math.min(indexOfLastStaff, filteredStaff.length)} của {filteredStaff.length} mục </span>
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
                          Previous
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
                          Next
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
        {selectedPump && (
          <>
            <div
              className="overlay"
              onClick={() => setSelectedPump(null)}
            ></div>
            <div className="viewStaff">
              <h2>VÒI BƠM</h2>
              <AiOutlineClose
                onClick={() => setSelectedPump(null)}
                className="close-icon"
              />
              <label> Tên
                <input
                  type="text"
                  value={selectedPump.pumpName}
                  onChange={(e) =>
                    setSelectedPump({
                      ...selectedPump,
                      pumpName: e.target.value,
                    })
                  }
                />
              </label>
              <br />
              <label> Mã
                <input
                  type="text"
                  value={parseInt(selectedPump.pumpCode)}
                  readOnly
                />
              </label>
              <br />
              <label> Trạng thái
                <select
                  value={selectedPump.pumpStatus}
                  onChange={(e) =>
                    setSelectedPump({
                      ...selectedPump,
                      pumpStatus: e.target.value,
                    })
                  }
                    >
                        <option value="ON USE">Đang hoạt động</option>
                        <option value="NOT ON USE">Ngừng hoạt động</option>
                  </select>
              </label>
              <label> Mặt hàng
                <select
                  value={selectedPump.product.productCode}
                  onChange={(e) => {
                    const selectedProduct = product.find(
                      (p) => parseInt(p.productCode) === parseInt(e.target.value)
                    );
                    setSelectedPump({
                      ...selectedPump,
                      product: {
                        productCode: parseInt(selectedProduct.productCode),
                        productName: selectedProduct.productName,
                      },
                    });
                  }}
                >
                    {product.map((product) => (
                      <option
                        key={product.productCode}
                        value={product.productCode}
                      >
                       {product.productCode} - {product.productName}
                      </option>
                    ))}
                </select>
              </label>
              <label> Bể
                <select
                  value={selectedPump.tank.tankCode}
                  onChange={(e) => {
                    const selectedTank = tanks.find(
                      (t) => parseInt(t.tankCode) === parseInt(e.target.value)
                    );
                    setSelectedPump({
                      ...selectedPump,
                      tank: {
                        tankCode: parseInt(selectedTank.tankCode),
                        tankName: selectedTank.tankName,
                      },
                    });
                  }}
                >
                    {tanks.map((tank) => (
                      <option key={tank.tankCode} value={tank.tankCode}>
                         {tank.tankCode} - {tank.tankName}
                      </option>
                    ))}
                </select>
              </label>
              <button className="send" onClick={saveChanges}>
                OK
              </button>
            </div>
          </>
        )}
        {addingStaff && (
          <>
            <div
              className="overlay"
              onClick={() => setAddingStaff(false)}
            ></div>
            <div className="addStaff">
              <h2>Thêm Vòi Bơm Mới</h2>
              <AiOutlineClose
                onClick={() => setAddingStaff(false)}
                className="close-icon"
              />
              <label> Tên
                <input
                  type="text"
                  value={newStaff.pumpName}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, pumpName: e.target.value })
                  }
                />
              </label>
              <br />
              <label> Mã
                <input
                  type="text"
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, pumpCode: parseInt(e.target.value) })
                  }
                />
              </label>
              <br />
              <label> Trạng thái
                <select
                  value={newStaff.pumpStatus}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, pumpStatus: e.target.value })
                  }
                >
                    <option value="ON USE">Đang kinh doanh</option>
                    <option value="NOT ON USE">Ngừng kinh doanh</option>
                </select>
              </label>
              <label> Mặt hàng
                <select
                  value={newStaff.product.productCode}
                  onChange={(e) => {
                    const selectedProduct = product.find(
                      (p) => parseInt(p.productCode) === parseInt(e.target.value)
                    );
                    setNewStaff({
                      ...newStaff,
                      product: {
                        productCode: parseInt(selectedProduct.productCode),
                        productName: selectedProduct.productName,
                      },
                    });
                  }}
                >
                  {product.length > 0 ? (
                      product.map((product) => (
                        <option
                          key={product.productCode}
                          value={product.productCode}
                        >
                            {product.productCode} - {product.productName}
                        </option>
                      ))
                  ) : (
                    <option>Chưa có thông tin mặt hàng</option>
                  )}
                </select>
              </label>
              <label> Bể
                <select
                  value={newStaff.tank.tankCode}
                  onChange={(e) => {
                    const selectedTank = tanks.find(
                      (t) => parseInt(t.tankCode) === parseInt(e.target.value)
                    );
                    setNewStaff({
                      ...newStaff,
                      tank: {
                        tankCode: parseInt(selectedTank.tankCode),
                        tankName: parseInt(selectedTank.tankName),
                      },
                    });
                  }}
                >
                  {tanks.length > 0 ? (
                      tanks.map((tank) => (
                        <option key={tank.tankCode} value={tank.tankCode}>
                            {tank.tankCode} - {tank.tankName}
                        </option>
                      ))
                  ) : (
                    <option>Chưa có thông tin bể</option>
                  )}
                </select>
              </label>
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
                  text: "VÒI BƠM",
                },
              },
            }}
          />
        </div>
      </div>
      {popup.show && (
        <Popup
          title={popup.title}
          message={popup.message}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default Pump;
