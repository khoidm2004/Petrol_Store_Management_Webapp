import { useEffect, useState } from "react";
import useTankStore from "../../../store/tankStore.js";
import useProductStore from "../../../store/productStore.js";
import { AiOutlineClose } from "react-icons/ai";
import { Doughnut } from "react-chartjs-2";
import { TbEyeEdit } from "react-icons/tb";
import "chart.js/auto";
import "./staff.css";
import Popup from '../Popup/Popup';

export const Tank = () => {
  const tanks = useTankStore((state) => state.tanks);
  const fetchTank = useTankStore((state) => state.fetchTank);
  const addTank = useTankStore((state) => state.addTank);
  const modifyTank = useTankStore((state) => state.modifyTank);
  const [popup, setPopup] = useState({ show: false, title: '', message: '' });

  const products = useProductStore((state) => state.products); 
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  const [selectedTank, setSelectedTank] = useState(null);
  const [addingTank, setAddingTank] = useState(false);
  const [viewMode, setViewMode] = useState("use");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const [newTank, setNewTank] = useState({
    tid: "",
    tankId: Math.floor(100000 + Math.random() * 900000),
    tankCode: 0,
    tankName: "",
    tankStatus: "ON USE",
    tankVolume: 0,
    product: {
      productName: "",
      productCode: "",
      quantity_left: Math.floor(100 + Math.random() * 9),
    },
  });

  useEffect(() => {
    fetchTank();
    fetchProducts();
  }, [fetchTank, fetchProducts]);

  useEffect(() => {
    if (products.length > 0) {
      setNewTank({
        ...newTank,
        product: {
          productName: products[0].productName,
          productCode: products[0].productCode,
          quantity_left: newTank.product.quantity_left,
        },
      });
    }
  }, [products]);

  const handleEdit = (tank) => {
    setSelectedTank(tank);
  };

  const saveChanges = async () => {
    if (selectedTank) {
      try {
        await modifyTank(selectedTank);
        setSelectedTank(null);
      } catch (error) {
        console.error("Save error:", error);
      }
    }
  };

  const handleAddTank = async () => {
    if (!newTank.tankName || !newTank.tankCode || !newTank.tankVolume) {
      setPopup({
        show: true,
        title: 'Error',
        message: 'Please fill in all the required fields.',
      });
      return;
    }
    try {
      const result = await addTank(newTank);
      setPopup({
        show: true,
        title: 'Notification',
        message: result.Message,
      });
      setNewTank({
        tid: "",
        tankId: Math.floor(100000 + Math.random() * 900000),
        tankCode: 0,
        tankName: "",
        tankStatus: "ON USE",
        tankVolume: 0,
        product:
          products.length > 0
            ? {
                productName: products[0].productName,
                productCode: products[0].productCode,
                quantity_left: Math.floor(100 + Math.random() * 9),
              }
            : { productName: "", productCode: "" , quantity_left: Math.floor(100 + Math.random() * 9)},
      });
      setAddingTank(false);
    } catch (error) {
      setPopup({
        show: true,
        title: 'Error',
        message: error,
      });
    }
  };

  const firstNumber = tanks.filter(
    (tank) => tank.tankStatus === "ON USE"
  ).length;
  const secondNumber = tanks.filter(
    (tank) => tank.tankStatus === "NOT ON USE"
  ).length;

  const data = {
    labels: ["In Use", "Not in Use"],
    datasets: [
      {
        label: "Tanks",
        data: [firstNumber, secondNumber],
        backgroundColor: ["Green", "Red"],
        hoverOffset: 10,
      },
    ],
  };

  const workingTank = tanks.filter(tank => tank.tankStatus === "ON USE");
  const notWorkingTank = tanks.filter(tank => tank.tankStatus === "NOT ON USE");

  const filteredTanks = (viewMode === "use" ? workingTank : notWorkingTank).filter(
    (tank) =>
      tank.tankCode.toString().includes(searchQuery) ||
      tank.tankName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastTank = currentPage * perPage;
  const indexOfFirstTank = indexOfLastTank - perPage;
  const displayedTanks = filteredTanks.slice(indexOfFirstTank, indexOfLastTank);

  const totalPages = Math.ceil(filteredTanks.length / perPage);
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
    <div className="revenue">
      {showOverlay && 
       <div className="overlay">
        <div className="loader">
          <svg className="circular" viewBox="25 25 50 50">
            <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10"/>
          </svg>
        </div>
      </div>}
      <header className="header_staff">
        <p>TANK INFORMATION</p>
        <div className="search-container">
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
          ADD
        </button>
      </header>
      <div className="Staffs">
        <div className="box_staff">
          <table className="firsttable">
            <thead>
              <tr className="titleOneline">
                <th>No</th>
                <th>
                  <select onChange={(e) => setViewMode(e.target.value)} value={viewMode}>
                    <option value="use">In Use</option>
                    <option value="notUse">Not in Use</option>
                  </select>
                </th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
            {displayedTanks.length > 0 ? (
              displayedTanks.map((tank, index) => (
                <tr key={tank.tankCode} className="col" id="mainstate">
                  <td>{indexOfFirstTank + index + 1}</td>
                  <td>{tank.tankName} - {tank.tankCode}</td>
                  <td className="icon_editview">
                    <TbEyeEdit className="icon_menu"
                      onClick={() => handleEdit(tank)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">
                  {searchQuery ? "No tank information found." : "No tank information available."}
                </td>
              </tr>
            )}
            <tr>
              <td colSpan="3" className="noLine">
              {displayedTanks.length > 0 && (
                <div className="pagination">
                  <p>
                  <span>Displaying {indexOfFirstTank + 1} to {Math.min(indexOfLastTank, filteredTanks.length)} of {filteredTanks.length} items </span>
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
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div className="box_staff">
          <h2 style={{ textAlign: "center" }}>Statistics</h2>
          <Doughnut data={data} />
        </div>
      </div>

      {addingTank && (
        <div className="popup">
          <div className="popup-inner">
            <h2>ADD TANK</h2>
            <div className="popup-content">
              <button className="close-popup" onClick={() => setAddingTank(false)}>
                <AiOutlineClose />
              </button>
              <div className="form-container">
                <label htmlFor="tankName">Tank Name:</label>
                <input
                  type="text"
                  id="tankName"
                  value={newTank.tankName}
                  onChange={(e) =>
                    setNewTank({ ...newTank, tankName: e.target.value })
                  }
                />
                <label htmlFor="tankCode">Tank Code:</label>
                <input
                  type="number"
                  id="tankCode"
                  value={newTank.tankCode}
                  onChange={(e) =>
                    setNewTank({ ...newTank, tankCode: e.target.value })
                  }
                />
                <label htmlFor="tankVolume">Tank Volume:</label>
                <input
                  type="number"
                  id="tankVolume"
                  value={newTank.tankVolume}
                  onChange={(e) =>
                    setNewTank({ ...newTank, tankVolume: e.target.value })
                  }
                />
                <label htmlFor="product">Product:</label>
                <select
                  id="product"
                  value={newTank.product.productCode}
                  onChange={(e) =>
                    setNewTank({
                      ...newTank,
                      product: {
                        ...newTank.product,
                        productCode: e.target.value,
                        productName: products.find((product) => product.productCode === e.target.value)?.productName || '',
                      },
                    })
                  }
                >
                  {products.map((product) => (
                    <option key={product.productCode} value={product.productCode}>
                      {product.productName}
                    </option>
                  ))}
                </select>
                <button className="save-btn" onClick={handleAddTank}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTank && (
        <div className="popup">
          <div className="popup-inner">
            <h2>EDIT TANK</h2>
            <div className="popup-content">
              <button className="close-popup" onClick={() => setSelectedTank(null)}>
                <AiOutlineClose />
              </button>
              <div className="form-container">
                <label htmlFor="tankName">Tank Name:</label>
                <input
                  type="text"
                  id="tankName"
                  value={selectedTank.tankName}
                  onChange={(e) =>
                    setSelectedTank({
                      ...selectedTank,
                      tankName: e.target.value,
                    })
                  }
                />
                <label htmlFor="tankCode">Tank Code:</label>
                <input
                  type="number"
                  id="tankCode"
                  value={selectedTank.tankCode}
                  onChange={(e) =>
                    setSelectedTank({
                      ...selectedTank,
                      tankCode: e.target.value,
                    })
                  }
                />
                <label htmlFor="tankVolume">Tank Volume:</label>
                <input
                  type="number"
                  id="tankVolume"
                  value={selectedTank.tankVolume}
                  onChange={(e) =>
                    setSelectedTank({
                      ...selectedTank,
                      tankVolume: e.target.value,
                    })
                  }
                />
                <label htmlFor="tankStatus">Tank Status:</label>
                <select
                  id="tankStatus"
                  value={selectedTank.tankStatus}
                  onChange={(e) =>
                    setSelectedTank({
                      ...selectedTank,
                      tankStatus: e.target.value,
                    })
                  }
                >
                  <option value="ON USE">ON USE</option>
                  <option value="NOT ON USE">NOT ON USE</option>
                </select>
                <label htmlFor="product">Product:</label>
                <select
                  id="product"
                  value={selectedTank.product.productCode}
                  onChange={(e) =>
                    setSelectedTank({
                      ...selectedTank,
                      product: {
                        ...selectedTank.product,
                        productCode: e.target.value,
                        productName: products.find((product) => product.productCode === e.target.value)?.productName || '',
                      },
                    })
                  }
                >
                  {products.map((product) => (
                    <option key={product.productCode} value={product.productCode}>
                      {product.productName}
                    </option>
                  ))}
                </select>
                <button className="save-btn" onClick={saveChanges}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {popup.show && (
        <Popup
          show={popup.show}
          title={popup.title}
          message={popup.message}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default Tank;
