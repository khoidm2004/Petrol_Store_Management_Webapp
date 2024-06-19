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

export const Pump = () => {
  const pumps = usePumpStore((state) => state.pumps);
  const fetchPump = usePumpStore((state) => state.fetchPump);
  const addPump = usePumpStore((state) => state.addPump);
  const modifyPump = usePumpStore((state) => state.modifyPump);
  const product = useProductStore((state) => state.product);
  const fetchProduct = useProductStore((state) => state.fetchProduct);

  const tanks = useTankStore((state) => state.tanks);
  const fetchTank = useTankStore((state) => state.fetchTank);

  const [openEmail, setOpenEmail] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [addingStaff, setAddingStaff] = useState(false);
  const pumpId = Math.floor(100000 + Math.random() * 900000);

  // while(pumps.filter(TankMember => TankMember.pumpId === pumpId)){
  //   pumpId = Math.floor(100000 + Math.random() * 900000);
  // }
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

  const toggleSubMenu = (email) => {
    if (openEmail === email) {
      setOpenEmail(null);
    } else {
      setOpenEmail(email);
    }
  };

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

  const handleView = (staffMember) => {
    setSelectedStaff(staffMember);
    setEditMode(false);
  };

  const handleEdit = (staffMember) => {
    setSelectedStaff(staffMember);
    setEditMode(true);
  };

  const saveChanges = async () => {
    if (editMode && selectedStaff) {
      try {
        await modifyPump(selectedStaff);
        setEditMode(false);
        setSelectedStaff(null);
      } catch (error) {
        console.error("Save error:", error);
      }
    }
  };

  const handleAddStaff = () => {
    try {
      console.log(newStaff);
      const result = addPump(newStaff);
      console.log(result);
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
        <p>THÔNG TIN VÒI BƠM</p>
        <div className="search-container">
          <FaMagnifyingGlass className="search-icon" />
          <input type="text" placeholder="Search..." className="search-input" />
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
        <table className="firsttable">
          <thead>
            <tr className="titleOneline">
              <th>Đang Kinh doanh</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {workingStaff.map((staffMember) => (
              <tr key={staffMember.pumpCode} className="col" id="mainstate">
                <td>{staffMember.pumpName}</td>
                <td className="icon_editview">
                  <TbEyeEdit className="icon_menu"
                    onClick={() => handleEdit(staffMember)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
          {/* <table className="secondtable">
            <thead className="titleOffline">
              <tr>
                <th colSpan={2}>Đã nghỉ việc</th>
              </tr>
            </thead>
            <tbody>
              {notWorkingStaff.map((staffMember) => (
                <tr key={staffMember.pumpCode} className="col" id="mainstate">
                  <td>{staffMember.pumpName}</td>
                  <td className="icon_editview">
                    <IoEllipsisVerticalOutline
                      cclassName="icon_menu"
                      onClick={() => toggleSubMenu(staffMember.pumpCode)}
                    />
                    {openEmail === staffMember.pumpCode && (
                      <table className="secondarystate">
                        <tbody>
                          <tr className="box">
                            <td onClick={() => handleView(staffMember)}>
                              VIEW
                            </td>
                          </tr>
                          <tr className="box">
                            <td onClick={() => handleEdit(staffMember)}>
                              EDIT
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table> */}
        </div>
      </div>
    </div>
  );
};

export default Pump;
