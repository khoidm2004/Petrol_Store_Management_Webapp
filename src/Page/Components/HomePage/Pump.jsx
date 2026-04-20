import { useEffect, useState, useMemo } from "react";
import usePumpStore from "../../../store/pumpStore.js";
import useTankStore from "../../../store/tankStore.js";
import useProductStore from "../../../store/productStore.js";
import { AiOutlineClose } from "react-icons/ai";
import { Doughnut } from "react-chartjs-2";
import { TbEyeEdit } from "react-icons/tb";
import "chart.js/auto";
import "./staff.css";
import Popup from "../Popup/Popup.jsx";
import { useTranslation } from "react-i18next";

const Pump = () => {
  const { t } = useTranslation();
  
  const pumps = usePumpStore((state) => state.pumps);
  const fetchPump = usePumpStore((state) => state.fetchPump);
  const addPump = usePumpStore((state) => state.addPump);
  const modifyPump = usePumpStore((state) => state.modifyPump);

  const {  tanks, fetchTank } = useTankStore();
  const { product, fetchProduct } = useProductStore();
  const [selectedPump, setSelectedPump] = useState(null);
  const [addingStaff, setAddingStaff] = useState(false);
  const pumpId = Math.floor(100000 + Math.random() * 900000);

  const [viewMode, setViewMode] = useState("fullUse");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
    status: "",
  });

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
    fetchTank();
    fetchProduct();
  }, [fetchPump]);

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

  const handleEdit = (pumpMember) => {
    setSelectedPump(pumpMember);
  };

  const dataPump_product = tanks.map((tank) => ({
    tankCode: tank.tankCode,
    productCode: parseInt(tank.product.productCode),
  }));

  const saveChanges = async () => {
    if (selectedPump) {
      try {
        if (!selectedPump.pumpCode || !selectedPump.pumpName) {
          setPopup({
            show: true,
            title: t("common.error"),
            message: t("messages.fillPumpInfo"),
            status: "warning",
          });
          return;
        }

        const isMatched = dataPump_product.some(
          (tank) =>
            parseInt(tank.tankCode) === parseInt(selectedPump.tank.tankCode) &&
            parseInt(tank.productCode) ===
              parseInt(selectedPump.product.productCode)
        );

        if (!isMatched) {
          setPopup({
            show: true,
            title: t("common.error"),
            message: t("messages.tankProductMismatch"),
            status: "error",
          });
          return;
        }

        const result = await modifyPump(selectedPump);
        setPopup({
          show: true,
          title: result.Title,
          message: result.Message,
          status: result.Status,
        });
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
        title: t("common.error"),
        message: t("messages.fillPumpInfo"),
        status: "warning",
      });
      return;
    }

    const isMatched = dataPump_product.some(
      (tank) =>
        parseInt(tank.tankCode) === parseInt(newStaff.tank.tankCode) &&
        parseInt(tank.productCode) === parseInt(newStaff.product.productCode)
    );

    if (!isMatched) {
      setPopup({
        show: true,
        title: t("common.error"),
        message: t("messages.tankProductMismatch"),
        status: "error",
      });
      return;
    }

    try {
      const result = await addPump(newStaff);
      setPopup({
        show: true,
        title: result.Title,
        message: result.Message,
        status: result.Status,
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
    (pumpMember) => pumpMember.pumpStatus === "ON USE"
  ).length;
  const secondNumber = pumps.filter(
    (pumpMember) => pumpMember.pumpStatus === "NOT ON USE"
  ).length;

  const data = useMemo(
    () => ({
      labels: [t("messages.pumpActive"), t("messages.pumpInactive")],
      datasets: [
        {
          label: t("charts.pump"),
          data: [firstNumber, secondNumber],
          backgroundColor: ["Green", "Red"],
          hoverOffset: 20,
        },
      ],
    }),
    [firstNumber, secondNumber, t]
  );

  const workingPump = pumps.filter((pumps) => pumps.pumpStatus === "ON USE");
  const notWorkingPump = pumps.filter(
    (pumps) => pumps.pumpStatus === "NOT ON USE"
  );

  const filteredPump = (
    viewMode === "fullUse"
      ? pumps
      : viewMode === "use"
      ? workingPump
      : notWorkingPump
  )
    .filter(
      (pumps) =>
        pumps.pumpCode.toString().includes(searchQuery) ||
        pumps.pumpName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      return a.pumpCode - b.pumpCode;
    });

  if (searchQuery !== "" && currentPage !== 1) {
    setCurrentPage(1);
  }
  const indexOfLastPump = currentPage * perPage;
  const indexOfFirstPump = indexOfLastPump - perPage;
  const displayedPump = filteredPump.slice(indexOfFirstPump, indexOfLastPump);

  const totalPages = Math.ceil(filteredPump.length / perPage);

  const closePopup = () => {
    setPopup({ show: false, title: "", message: "", status: "" });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="revenue">
      <header className="header_staff">
        <p>{t("pages.pumpInfo")}</p>
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
                <th>{t("tables.pumpCode")}</th>
                <th>
                  <select
                    onChange={(e) => setViewMode(e.target.value)}
                    value={viewMode}
                  >
                    <option value="fullUse">{t("messages.allPumps")}</option>
                    <option value="use">{t("messages.pumpInUse")}</option>
                    <option value="noUse">{t("messages.pumpNotInUse")}</option>
                  </select>
                </th>
                <th>{t("tables.tank")}</th>
                <th>{t("tables.detail")}</th>
              </tr>
            </thead>
            <tbody>
              {displayedPump.length > 0 ? (
                displayedPump.map((items, index) => (
                  <tr key={items.pumpCode} className="col" id="mainstate">
                    <td className="center_sum">
                      {indexOfFirstPump + index + 1}
                    </td>
                    <td> {items.pumpCode} </td>
                    <td>{items.pumpName}</td>
                    <td>{items.tank.tankName}</td>
                    <td className="icon_editview">
                      <TbEyeEdit
                        className="icon_menu"
                        onClick={() => handleEdit(items)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="center_sum">
                    {searchQuery
                      ? t("messages.pumpNotFound")
                      : t("messages.pumpEmpty")}
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan="5" className="noLine">
                  {displayedPump.length > 0 && (
                    <div className="pagination">
                      <p>
                        <span>
                          {t("pagination.pumpList", {
                            from: indexOfFirstPump + 1,
                            to: Math.min(indexOfLastPump, filteredPump.length),
                            total: filteredPump.length,
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
        {selectedPump && (
          <>
            <div
              className="overlay"
              onClick={() => setSelectedPump(null)}
            ></div>
            <div className="viewStaff">
              <h2>{t("messages.pumpModal")}</h2>
              <AiOutlineClose
                onClick={() => setSelectedPump(null)}
                className="close-icon"
              />
              <label>
                {" "}
                {t("tables.name")}
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
              <label>
                {" "}
                {t("messages.code")}
                <input
                  type="text"
                  value={parseInt(selectedPump.pumpCode)}
                  readOnly
                />
              </label>
              <br />
              <label>
                {" "}
                {t("tables.status")}
                <select
                  value={selectedPump.pumpStatus}
                  onChange={(e) =>
                    setSelectedPump({
                      ...selectedPump,
                      pumpStatus: e.target.value,
                    })
                  }
                >
                  <option value="ON USE">{t("messages.pumpActive")}</option>
                  <option value="NOT ON USE">{t("messages.pumpInactive")}</option>
                </select>
              </label>
              <label>
                {" "}
                {t("tables.product")}
                <select
                  value={selectedPump.product.productCode}
                  onChange={(e) => {
                    const selectedProduct = product.find(
                      (p) =>
                        parseInt(p.productCode) === parseInt(e.target.value)
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
              <label>
                {" "}
                {t("tables.tank")}
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
                {t("messages.ok")}
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
              <h2>{t("messages.newPumpTitle")}</h2>
              <AiOutlineClose
                onClick={() => setAddingStaff(false)}
                className="close-icon"
              />
              <label>
                {" "}
                {t("tables.name")}
                <input
                  type="text"
                  value={newStaff.pumpName}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, pumpName: e.target.value })
                  }
                />
              </label>
              <br />
              <label>
                {" "}
                {t("messages.code")}
                <input
                  type="text"
                  onChange={(e) =>
                    setNewStaff({
                      ...newStaff,
                      pumpCode: parseInt(e.target.value),
                    })
                  }
                />
              </label>
              <br />
              <label>
                {" "}
                {t("tables.product")}
                <select
                  value={newStaff.product.productCode}
                  onChange={(e) => {
                    const selectedProduct = product.find(
                      (p) =>
                        parseInt(p.productCode) === parseInt(e.target.value)
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
                    <option>{t("messages.noProductInfo")}</option>
                  )}
                </select>
              </label>
              <label>
                {" "}
                {t("tables.tank")}
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
                    <option>{t("messages.noTankInfo")}</option>
                  )}
                </select>
              </label>
              <button className="send" onClick={handleAddStaff}>
                {t("common.add")}
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
                  text: t("messages.pumpModal"),
                },
                datalabels: {
                  display: false, 
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
          status={popup.status}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default Pump;
