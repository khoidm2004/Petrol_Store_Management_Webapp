import { useEffect, useState } from "react";
import useShiftStore from "../../../store/shiftStore.js";
import useProductStore from "../../../store/productStore.js";
import usePumpStore from "../../../store/pumpStore.js";
import useStaffStore from "../../../store/staffStore.js";
import { TbEyeEdit } from "react-icons/tb";
import { FaRegMinusSquare } from "react-icons/fa";
import "chart.js/auto";
import "./staff.css";
import Popup from "../Popup/Popup.jsx";
import { timeConverter } from "../../../utils/timeConverter.js";

const Shift = () => {
  const shifts = useShiftStore((state) => state.shifts);
  const fetchShift = useShiftStore((state) => state.fetchShift);
  const addShift = useShiftStore((state) => state.addShift);
  const modifyShift = useShiftStore((state) => state.modifyShift);

  const { product, fetchProduct } = useProductStore();
  const { staff, fetchStaff } = useStaffStore();
  const { pumps, fetchPump } = usePumpStore();
  const [selectedShift, setSelectedShift] = useState(null);
  const [addingShift, setAddingShift] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
    status: "",
  });
  const [newShift, setNewShift] = useState({
    startTime: "",
    endTime: "",
    pumpList: {},
    employeeList: {},
    productList: {},
  });

  useEffect(() => {
    fetchProduct();
    fetchShift();
    fetchPump();
    fetchStaff();
  }, [fetchShift]);

  const handleEdit = (shift) => {
    setSelectedShift(shift);
  };

  const saveChanges = async () => {
    if (selectedShift) {
      if (
        !selectedShift.startTime ||
        !selectedShift.endTime ||
        Object.keys(selectedShift.employeeList).length === 0 ||
        Object.keys(selectedShift.productList).length === 0
      ) {
        setPopup({
          show: true,
          title: "Thông báo",
          message: "Vui lòng điền đẩy đủ thông tin của ca.",
          status: "warning",
        });
        return;
      }

      const start = new Date(selectedShift.startTime);
      const end = new Date(selectedShift.endTime);

      const differenceInHours = (end - start) / (1000 * 60 * 60);

      if (differenceInHours < 0) {
        setPopup({
          show: true,
          title: "Thông báo",
          message: "Quãng thời gian của ca không hợp lệ.",
          status: "info",
        });
        return;
      }

      if (differenceInHours < 2) {
        setPopup({
          show: true,
          title: "Thông báo",
          message: "Thời gian tối thiểu kết thúc sau 2 tiếng sau khi bắt đầu.",
          status: "info",
        });
        return;
      }

      try {
        const result = await modifyShift(selectedShift);
        setPopup({
          show: true,
          title: result.Title,
          message: result.Message,
          status: result.Status,
        });
        setSelectedShift(null);
      } catch (error) {
        console.error("Save error:", error);
      }
    }
  };

  const handleAddShift = async () => {
    if (
      !newShift.startTime ||
      !newShift.endTime ||
      Object.keys(newShift.employeeList).length === 0 ||
      Object.keys(newShift.productList).length === 0
    ) {
      setPopup({
        show: true,
        title: "Thông báo",
        message: "Vui lòng điền đầy đủ thông tin của ca.",
        status: "warning",
      });
      return;
    }

    const start = new Date(newShift.startTime);
    const end = new Date(newShift.endTime);

    const differenceInHours = (end - start) / (1000 * 60 * 60);

    if (differenceInHours < 0) {
      setPopup({
        show: true,
        title: "Thông báo",
        message: "Quãng thời gian của ca không hợp lệ.",
        status: "info",
      });
      return;
    }

    if (differenceInHours < 2) {
      setPopup({
        show: true,
        title: "Thông báo",
        message: "Thời gian tối thiểu kết thúc sau 2 tiếng sau khi bắt đầu.",
        status: "info",
      });
      return;
    }

    try {
      const result = await addShift(newShift);
      setPopup({
        show: true,
        title: result.Title,
        message: result.Message,
        status: result.Status,
      });
      setNewShift({
        startTime: "",
        endTime: "",
        pumpList: {},
        employeeList: {},
        productList: {},
      });
      setAddingShift(false);
    } catch (error) {
      setPopup({
        show: true,
        title: "Thông báo",
        message: error,
        status: "error",
      });
    }
  };

  const handleRemoveEmployee = (key) => {
    const newEmployeeList = { ...selectedShift.employeeList };
    delete newEmployeeList[key];

    const reIndexedEmployeeList = {};
    Object.values(newEmployeeList).forEach((employee, index) => {
      const newKey = `Staff${index + 1}`;
      reIndexedEmployeeList[newKey] = employee;
    });

    setSelectedShift((prevShift) => ({
      ...prevShift,
      employeeList: reIndexedEmployeeList,
    }));
  };

  const handleRemoveProduct = (key) => {
    const newProductList = { ...selectedShift.productList };
    delete newProductList[key];

    const reIndexedProductList = {};
    Object.values(newProductList).forEach((product, index) => {
      const newKey = `Product${index + 1}`;
      reIndexedProductList[newKey] = product;
    });

    setSelectedShift((prevShift) => ({
      ...prevShift,
      productList: reIndexedProductList,
    }));
  };

  const handleRemoveNewEmployee = (key) => {
    const newEmployeeList = { ...newShift.employeeList };
    delete newEmployeeList[key];

    const reIndexedEmployeeList = {};
    Object.values(newEmployeeList).forEach((employee, index) => {
      const newKey = `Staff${index + 1}`;
      reIndexedEmployeeList[newKey] = employee;
    });

    setNewShift((prevShift) => ({
      ...prevShift,
      employeeList: reIndexedEmployeeList,
    }));
  };

  const handleRemoveNewProduct = (key) => {
    const newProductList = { ...newShift.productList };
    delete newProductList[key];

    const reIndexedProductList = {};
    Object.values(newProductList).forEach((product, index) => {
      const newKey = `Product${index + 1}`;
      reIndexedProductList[newKey] = product;
    });

    setNewShift((prevShift) => ({
      ...prevShift,
      productList: reIndexedProductList,
    }));
  };

  const [searchQuery, setSearchQuery] = useState("");
  const filteredShifts = shifts.filter((shift) => {
    const filteredEmployees = Object.values(shift.employeeList).some(
      (shifts) => {
        return shifts.fullName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      }
    );
    return filteredEmployees;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  if (searchQuery !== "" && currentPage !== 1) {
    setCurrentPage(1);
  }
  const indexOfLastShift = currentPage * perPage;
  const indexOfFirstShift = indexOfLastShift - perPage;
  const displayedShift = filteredShifts.slice(
    indexOfFirstShift,
    indexOfLastShift
  );

  const totalPages = Math.ceil(filteredShifts.length / perPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const closePopup = () => {
    setPopup({ show: false, title: "", message: "", status: "" });
  };

  return (
    <div className="revenue">
      <header className="header_staff">
        <p>THÔNG TIN CA BÁN HÀNG</p>
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
          onClick={() => setAddingShift(true)}
        >
          THÊM
        </button>
      </header>
      <div>
        <div className="box_shift">
          <table className="firsttable_shift">
            <thead>
              <tr className="titleOneline">
                <th className="center_sum">STT</th>
                <th>Ca bán hàng</th>
                <th>Thời lượng</th>
                <th>Nhân viên phụ trách</th>
                <th className="view_chitiet">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {displayedShift.length > 0 ? (
                displayedShift.map((shift, index) => {
                  const startTime = Date.parse(shift.startTime);
                  const endTime = Date.parse(shift.endTime);
                  const duration = endTime - startTime;

                  const millisecondsPerDay = 1000 * 60 * 60 * 24;
                  const days = Math.floor(duration / millisecondsPerDay);
                  const hours = Math.floor(
                    (duration % millisecondsPerDay) / (1000 * 60 * 60)
                  );
                  const minutes = Math.floor(
                    (duration % (1000 * 60 * 60)) / (1000 * 60)
                  );

                  let durationString = "";
                  if (days > 0) {
                    durationString = `${days} ngày ${hours} giờ ${minutes} phút`;
                  } else {
                    durationString = `${hours} giờ ${minutes} phút`;
                  }

                  return (
                    <tr
                      className="col"
                      id="mainstate"
                      key={shift.ShiftId || index}
                    >
                      <td className="center_sum">
                        {indexOfFirstShift + index + 1}
                      </td>
                      <td>
                        {timeConverter(Date.parse(shift.startTime)).date} :{" "}
                        {timeConverter(Date.parse(shift.startTime)).time}
                        <br></br>{" "}
                        {timeConverter(Date.parse(shift.endTime)).date} :{" "}
                        {timeConverter(Date.parse(shift.endTime)).time}
                      </td>
                      <td>{durationString}</td>
                      <td>
                        {Object.values(shift.employeeList).map(
                          (pump, index) => (
                            <div key={index}>{pump.fullName}</div>
                          )
                        )}
                      </td>

                      <td className="icon_editview">
                        <TbEyeEdit
                          className="icon_menu"
                          onClick={() => handleEdit(shift)}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="center_sum">
                    Chưa tồn tại ca bán hàng
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              {displayedShift.length > 0 && (
                <tr>
                  <td colSpan={6} className="noLine">
                    <div className="pagination">
                      <p>
                        <span>
                          Đang hiển thị {indexOfFirstShift + 1} đến{" "}
                          {Math.min(indexOfLastShift, shifts.length)} của{" "}
                          {shifts.length} Ca Bán Hàng{" "}
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
                  </td>
                </tr>
              )}
            </tfoot>
          </table>
        </div>

        {selectedShift && (
          <>
            <div
              className="overlay"
              onClick={() => setSelectedShift(null)}
            ></div>
            <div className="viewShift" value="">
              <h2>Ca Bán Hàng</h2>
              <div className="Row">
                <label htmlFor="">
                  Thời gian bắt đầu
                  <input
                    type="datetime-local"
                    className="time"
                    value={selectedShift.startTime}
                    onChange={(e) =>
                      setSelectedShift({
                        ...selectedShift,
                        startTime: e.target.value,
                      })
                    }
                  />
                  <hr />
                </label>
                <label htmlFor="">
                  Thời gian kết thúc
                  <input
                    type="datetime-local"
                    className="time"
                    value={selectedShift.endTime}
                    onChange={(e) =>
                      setSelectedShift({
                        ...selectedShift,
                        endTime: e.target.value,
                      })
                    }
                  />
                  <br />
                </label>
              </div>
              <hr />
              <div>
                <h5>NHÂN VIÊN</h5>
                <div className="Staff">
                  {Object.entries(selectedShift.employeeList).map(
                    ([key, staffs]) => (
                      <div key={key} className="product-item">
                        <p className="title_shift">
                          {" "}
                          {staffs.fullName} - {staffs.email}{" "}
                        </p>
                        <FaRegMinusSquare
                          className="push_icon"
                          onClick={() => handleRemoveEmployee(key)}
                        />
                      </div>
                    )
                  )}
                  {staff.length > 0 &&
                    Object.values(selectedShift.employeeList).length <
                      staff.length && (
                      <div className="product-item">
                        <select
                          value=""
                          onChange={(e) => {
                            const selectedStaff = staff.find(
                              (p) => p.email === e.target.value
                            );
                            const employeeCount = Object.keys(
                              selectedShift.employeeList
                            ).length;
                            const newKey = `Staff${employeeCount + 1}`;

                            setSelectedShift((prevShift) => ({
                              ...prevShift,
                              employeeList: {
                                ...prevShift.employeeList,
                                [newKey]: {
                                  email: selectedStaff.email,
                                  fullName: selectedStaff.fullName,
                                },
                              },
                            }));
                          }}
                        >
                          <option value="">Thêm Nhân Viên</option>
                          {staff.map(
                            (newStaff) =>
                              !Object.values(selectedShift.employeeList).some(
                                (s) => s.email === newStaff.email
                              ) && (
                                <option
                                  key={newStaff.email}
                                  value={newStaff.email}
                                >
                                  {newStaff.fullName} - {newStaff.email}
                                </option>
                              )
                          )}
                        </select>
                      </div>
                    )}
                </div>
              </div>
              <hr />
              <div>
                <h5>MẶT HÀNG - VÒI BƠM</h5>
                <div className="Staff">
                  {Object.entries(selectedShift.productList).map(
                    ([key, product]) => (
                      <div key={key} className="product-item">
                        <p className="title_shift">
                          {product.productCode} - {product.productName}
                        </p>
                        <div>
                          {product.pumpList &&
                            Object.entries(product.pumpList).map(
                              ([pumpKey, pumpEntry], index) => (
                                <div key={index} className="pump-item">
                                  <p className="title_shift">
                                    {pumpEntry.pumpCode} - {pumpEntry.pumpName}
                                  </p>
                                  <input
                                    type="number"
                                    value={
                                      pumpEntry.firstMeterReadingByLitre || ""
                                    }
                                    placeholder="Số công tơ (L)"
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      setSelectedShift((prevShift) => ({
                                        ...prevShift,
                                        productList: {
                                          ...prevShift.productList,
                                          [key]: {
                                            ...prevShift.productList[key],
                                            pumpList: {
                                              ...prevShift.productList[key]
                                                ?.pumpList,
                                              [pumpKey]: {
                                                ...prevShift.productList[key]
                                                  ?.pumpList?.[pumpKey],
                                                firstMeterReadingByLitre:
                                                  newValue,
                                              },
                                            },
                                          },
                                        },
                                      }));
                                    }}
                                  />
                                  <input
                                    type="number"
                                    value={
                                      pumpEntry.firstMeterReadingByMoney || ""
                                    }
                                    placeholder="Số công tơ (M)"
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      setSelectedShift((prevShift) => ({
                                        ...prevShift,
                                        productList: {
                                          ...prevShift.productList,
                                          [key]: {
                                            ...prevShift.productList[key],
                                            pumpList: {
                                              ...prevShift.productList[key]
                                                ?.pumpList,
                                              [pumpKey]: {
                                                ...prevShift.productList[key]
                                                  ?.pumpList?.[pumpKey],
                                                firstMeterReadingByMoney:
                                                  newValue,
                                              },
                                            },
                                          },
                                        },
                                      }));
                                    }}
                                  />
                                  <br />
                                </div>
                              )
                            )}
                          {Object.entries(product.pumpList).length === 0 && (
                            <div>Chưa có Vòi bơm tương ứng với mặt hàng</div>
                          )}
                        </div>
                        <FaRegMinusSquare
                          className="push_icon"
                          onClick={() => handleRemoveProduct(key)}
                        />
                      </div>
                    )
                  )}
                  {product.length > 0 &&
                    Object.values(selectedShift.productList).length <
                      product.length && (
                      <div className="product-item">
                        <select
                          value=""
                          onChange={(e) => {
                            const selectedProduct = product.find(
                              (p) =>
                                parseInt(p.productCode) ===
                                parseInt(e.target.value)
                            );
                            const employeeCount = Object.keys(
                              selectedShift.productList
                            ).length;

                            const selectedPumps = pumps.filter(
                              (pump) =>
                                parseInt(pump.product.productCode) ===
                                parseInt(selectedProduct.productCode)
                            );

                            const initialPumpList = selectedPumps.reduce(
                              (acc, pump, index) => {
                                acc[`pump${index + 1}`] = {
                                  firstMeterReadingByLitre: "",
                                  firstMeterReadingByMoney: "",
                                  pumpCode: pump.pumpCode,
                                  pumpName: pump.pumpName,
                                };
                                return acc;
                              },
                              {}
                            );

                            const newKey = `Product${employeeCount + 1}`;
                            setSelectedShift((prevShift) => ({
                              ...prevShift,
                              productList: {
                                ...prevShift.productList,
                                [newKey]: {
                                  productCode: selectedProduct.productCode,
                                  productName: selectedProduct.productName,
                                  productPrice: selectedProduct.productPrice,
                                  pumpList: initialPumpList,
                                },
                              },
                            }));
                          }}
                        >
                          <option value="">Thêm Mặt Hàng</option>
                          {product.map(
                            (newProduct) =>
                              !Object.values(selectedShift.productList).some(
                                (s) =>
                                  parseInt(s.productCode) ===
                                  parseInt(newProduct.productCode)
                              ) && (
                                <option
                                  key={newProduct.productCode}
                                  value={newProduct.productCode}
                                >
                                  {newProduct.productCode} -{" "}
                                  {newProduct.productName}
                                </option>
                              )
                          )}
                        </select>
                      </div>
                    )}
                </div>
              </div>
              <div className="right_sum">
                <button className="send" onClick={saveChanges}>
                  LƯU
                </button>
              </div>
            </div>
          </>
        )}

        {addingShift && (
          <>
            <div
              className="overlay"
              onClick={() => setAddingShift(false)}
            ></div>
            <div className="addShift">
              <h2>Thêm Ca Mới</h2>
              <div className="Row">
                <label htmlFor="startTime">
                  Thời gian bắt đầu
                  <input
                    type="datetime-local"
                    id="startTime"
                    value={newShift.startTime}
                    onChange={(e) =>
                      setNewShift({ ...newShift, startTime: e.target.value })
                    }
                  />
                </label>
                <label htmlFor="endTime">
                  Thời gian kết thúc
                  <input
                    type="datetime-local"
                    id="endTime"
                    value={newShift.endTime}
                    onChange={(e) =>
                      setNewShift({ ...newShift, endTime: e.target.value })
                    }
                  />
                </label>
              </div>
              <hr />
              <div>
                <h5>NHÂN VIÊN</h5>
                <div className="Staff">
                  {Object.entries(newShift.employeeList).map(
                    ([key, staffs]) => (
                      <div key={key} className="product-item">
                        <p className="title_shift">
                          {staffs.fullName} - {staffs.email}
                        </p>
                        <FaRegMinusSquare
                          className="push_icon"
                          onClick={() => handleRemoveNewEmployee(key)}
                        />
                      </div>
                    )
                  )}
                  {staff.length > 0 &&
                    Object.values(newShift.employeeList).length <
                      staff.length && (
                      <div className="product-item">
                        <select
                          value=""
                          onChange={(e) => {
                            const selectedStaff = staff.find(
                              (p) => p.email === e.target.value
                            );
                            const employeeCount = Object.keys(
                              newShift.employeeList
                            ).length;
                            const newKey = `Staff${employeeCount + 1}`;
                            setNewShift((prevShift) => ({
                              ...prevShift,
                              employeeList: {
                                ...prevShift.employeeList,
                                [newKey]: {
                                  email: selectedStaff.email,
                                  fullName: selectedStaff.fullName,
                                },
                              },
                            }));
                          }}
                        >
                          <option value="">Thêm Nhân Viên</option>
                          {staff.map(
                            (newStaff) =>
                              !Object.values(newShift.employeeList).some(
                                (s) => s.email === newStaff.email
                              ) && (
                                <option
                                  key={newStaff.email}
                                  value={newStaff.email}
                                >
                                  {newStaff.fullName} - {newStaff.email}
                                </option>
                              )
                          )}
                        </select>
                      </div>
                    )}
                </div>
              </div>
              <hr />
              <div className="Row">
                <h5>MẶT HÀNG - VÒI BƠM</h5>

                <div className="Staff">
                  {Object.entries(newShift.productList).map(
                    ([key, product]) => (
                      <div key={key} className="product-item">
                        <p className="title_shift">
                          {product.productCode} - {product.productName}
                        </p>
                        <div>
                          {pumps.filter(
                            (pump) =>
                              parseInt(pump.product.productCode) ===
                              parseInt(product.productCode)
                          ).length > 0 ? (
                            pumps
                              .filter(
                                (pump) =>
                                  parseInt(pump.product.productCode) ===
                                  parseInt(product.productCode)
                              )
                              .map((pumpEntry, index) => (
                                <div key={index} className="pump-item">
                                  <p className="title_shift">
                                    {pumpEntry.pumpCode} - {pumpEntry.pumpName}
                                  </p>
                                  <input
                                    type="number"
                                    value={
                                      newShift.productList[key]?.pumpList[
                                        `pump${index + 1}`
                                      ]?.firstMeterReadingByLitre || ""
                                    }
                                    placeholder="Số công tơ (L)"
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      setNewShift((prevShift) => ({
                                        ...prevShift,
                                        productList: {
                                          ...prevShift.productList,
                                          [key]: {
                                            ...prevShift.productList[key],
                                            pumpList: {
                                              ...prevShift.productList[key]
                                                ?.pumpList,
                                              [`pump${index + 1}`]: {
                                                ...prevShift.productList[key]
                                                  ?.pumpList?.[
                                                  `pump${index + 1}`
                                                ],
                                                firstMeterReadingByLitre:
                                                  newValue,
                                                pumpCode: pumpEntry.pumpCode,
                                                pumpName: pumpEntry.pumpName,
                                              },
                                            },
                                          },
                                        },
                                      }));
                                    }}
                                  />
                                  <input
                                    type="number"
                                    value={
                                      newShift.productList[key]?.pumpList[
                                        `pump${index + 1}`
                                      ]?.firstMeterReadingByMoney || ""
                                    }
                                    placeholder="Số công tơ (M)"
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      setNewShift((prevShift) => ({
                                        ...prevShift,
                                        productList: {
                                          ...prevShift.productList,
                                          [key]: {
                                            ...prevShift.productList[key],
                                            pumpList: {
                                              ...prevShift.productList[key]
                                                ?.pumpList,
                                              [`pump${index + 1}`]: {
                                                ...prevShift.productList[key]
                                                  ?.pumpList?.[
                                                  `pump${index + 1}`
                                                ],
                                                firstMeterReadingByMoney:
                                                  newValue,
                                                pumpCode: pumpEntry.pumpCode,
                                                pumpName: pumpEntry.pumpName,
                                              },
                                            },
                                          },
                                        },
                                      }));
                                    }}
                                  />
                                  <br />
                                </div>
                              ))
                          ) : (
                            <div>Chưa có Vòi bơm tương ứng với mặt hàng</div>
                          )}
                        </div>
                        <FaRegMinusSquare
                          className="push_icon"
                          onClick={() => handleRemoveNewProduct(key)}
                        />
                      </div>
                    )
                  )}
                  {product.length > 0 &&
                    Object.values(newShift.productList).length <
                      product.length && (
                      <div className="product-item">
                        <select
                          value=""
                          onChange={(e) => {
                            const selectedProduct = product.find(
                              (p) =>
                                parseInt(p.productCode) ===
                                parseInt(e.target.value)
                            );
                            const employeeCount = Object.keys(
                              newShift.productList
                            ).length;
                            const newKey = `Product${employeeCount + 1}`;

                            const selectedPumps = pumps.filter(
                              (pump) =>
                                parseInt(pump.product.productCode) ===
                                parseInt(selectedProduct.productCode)
                            );

                            const initialPumpList = selectedPumps.reduce(
                              (acc, pump, index) => {
                                acc[`pump${index + 1}`] = {
                                  firstMeterReadingByLitre: "",
                                  firstMeterReadingByMoney: "",
                                  pumpCode: pump.pumpCode,
                                  pumpName: pump.pumpName,
                                };
                                return acc;
                              },
                              {}
                            );

                            setNewShift((prevShift) => ({
                              ...prevShift,
                              productList: {
                                ...prevShift.productList,
                                [newKey]: {
                                  productCode: selectedProduct.productCode,
                                  productName: selectedProduct.productName,
                                  productPrice: selectedProduct.productPrice,
                                  pumpList: initialPumpList,
                                },
                              },
                            }));
                          }}
                        >
                          <option value="">Thêm Mặt Hàng</option>
                          {product.map(
                            (newProduct) =>
                              !Object.values(newShift.productList).some(
                                (s) =>
                                  parseInt(s.productCode) ===
                                  parseInt(newProduct.productCode)
                              ) && (
                                <option
                                  key={newProduct.productCode}
                                  value={newProduct.productCode}
                                >
                                  {newProduct.productCode} -{" "}
                                  {newProduct.productName}
                                </option>
                              )
                          )}
                        </select>
                      </div>
                    )}
                </div>
              </div>
              <button className="send" onClick={handleAddShift}>
                THÊM
              </button>
            </div>
          </>
        )}
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

export default Shift;
