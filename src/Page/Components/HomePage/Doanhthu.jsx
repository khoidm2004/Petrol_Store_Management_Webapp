import { useEffect, useState, useCallback } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./Revenue.css";
import useFetchLog from "../../../hooks/FetchHooks/useFetchLog.js";
import { timeConverter } from "../../../utils/timeConverter.js";
import { AiOutlineClose } from "react-icons/ai";
import { GiFuelTank } from "react-icons/gi";
import { PiGasPumpBold } from "react-icons/pi";
import { AiOutlineProduct } from "react-icons/ai";
import { IoMdPeople } from "react-icons/io";
import { Link } from "react-router-dom";
import useFetchRevenue from "../../../hooks/FetchHooks/useFetchRevenue.js";
import useFetchPumpRevenue from "../../../hooks/FetchHooks/useFetchPumpRevenue.js";
import useTankStore from "../../../store/tankStore.js";
import useProductStore from "../../../store/productStore.js";
import usePumpStore from "../../../store/pumpStore.js";
import useStaffStore from "../../../store/staffStore.js";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
export const Revenue = () => {
  const { product, fetchProduct } = useProductStore();
  const { staff, fetchStaff } = useStaffStore();
  const { pumps, fetchPump } = usePumpStore();
  const { tanks, fetchTank } = useTankStore();
  const [selectedDateLog, setSelectedDateLog] = useState(new Date());
  const [selectedDateRevenue, setSelectedDateRevenue] = useState(new Date());
  const [selectedDatePumpRevenue, setSelectedDatePumpRevenue] = useState(
    new Date()
  );
  const formattedSelectedDateLog = selectedDateLog.toISOString().slice(0, 10);
  const formattedSelectedDateRevenue = selectedDateRevenue
    .toISOString()
    .slice(0, 10);
  const formattedSelectedDatePumpRevenue = selectedDatePumpRevenue
    .toISOString()
    .slice(0, 10);
  const [dailyData, setDailyData] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [logExists, setLogExists] = useState(false);
  const [showBarDetail, setShowBarDetail] = useState(false);
  const [showDoughnutDetail, setShowDoughnutDetail] = useState(false);
  const [leftData, setLeftData] = useState([]);
  const [searchQueryTank, setSearchQueryTank] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = localStorage.getItem("user-info");
    if (!userInfo) {
      navigate("/404");
    }
  }, [navigate]);

  const handleDateChangeLog = (e) => {
    const newDate = new Date(e.target.value);
    setSelectedDateLog(newDate);
  };

  const handleDateChangeRevenue = (e) => {
    const newDate = new Date(e.target.value);
    setSelectedDateRevenue(newDate);
  };

  const handleDateChangePumpRevenue = (e) => {
    const newDate = new Date(e.target.value);
    setSelectedDatePumpRevenue(newDate);
  };

  const formattedDateLog = selectedDateLog.toLocaleDateString("vi-VN", {
    month: "numeric",
    year: "numeric",
    day: "numeric",
  });

  const formattedDateRevenue = selectedDateRevenue.toLocaleDateString("vi-VN", {
    month: "numeric",
    year: "numeric",
    day: "numeric",
  });

  const formattedDatePumpRevenue = selectedDatePumpRevenue.toLocaleDateString(
    "vi-VN",
    {
      month: "numeric",
      year: "numeric",
      day: "numeric",
    }
  );

  const formatDatestring = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return `Ngày ${day} tháng ${month} năm ${year}`;
  };

  useEffect(() => {
    fetchProduct();
    fetchTank();
    fetchPump();
    fetchStaff();
  }, [fetchTank]);

  const staffNumber = staff.filter(
    (staffMember) => staffMember.workingStatus === "IS WORKING"
  ).length;
  const productNumber = product.length;
  const pumpNumber = pumps.length;
  const tankNumber = tanks.length;

  useEffect(() => {
    const fetchLogs = async () => {
      const result = await useFetchLog();
      if (result.Status !== "error") {
        const logs = result.filter((log) => {
          const logDate = new Date(log.startTime).toISOString().slice(0, 10);
          return logDate === formattedSelectedDateLog;
        });
        setDailyData(logs);
        setTotal(
          logs.reduce((sum, item) => sum + parseInt(item.totalAmount), 0)
        );
      }
    };
    fetchLogs();
  }, [formattedSelectedDateLog]);

  useEffect(() => {
    const fetchData = async () => {
      setLeftData(tanks);
      const totalQuantity = tanks.reduce(
        (sum, item) => sum + parseInt(item.product.quantity_left),
        0
      );
      const totalIncome = tanks.reduce(
        (sum, item) => sum + parseInt(item.tankVolume),
        0
      );
      setTotalIncome(totalIncome);
      setTotalQuantity(totalQuantity);
    };
    fetchData();
  }, [tanks]);

  const [selectedItem, setSelectedItem] = useState(null);
  const handleRowClick = useCallback((item) => {
    setSelectedItem(item);
  }, []);

  const doughnutData = {
    labels: ["Thể tích bể", "Mặt hàng tồn"],
    datasets: [
      {
        label: "Tồn kho",
        data: [totalQuantity, totalIncome],
        backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
        hoverOffset: 10,
      },
    ],
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  const [dataRevenue, setDataRevenue] = useState([]);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const revenueList = await useFetchRevenue();
        setDataRevenue(revenueList);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchRevenueData();
  }, []);

  const selectDate = new Date(formattedSelectedDateRevenue);
  const formatDate = selectDate.toLocaleDateString();
  const currentData = dataRevenue.find(
    (entry) => timeConverter(Date.parse(entry.date)).date === formatDate
  ) || {
    items: [],
  };

  const barData = {
    labels: currentData.items.map((item) => item.productName),
    datasets: [
      {
        label: "DOANH THU",
        data: currentData.items.map((item) => item.productRevenue),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "SẢN LƯỢNG",
        data: currentData.items.map((item) => item.productQuantity),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const result = await useFetchPumpRevenue();
        setRevenueData(result);
      } catch (error) {
        console.error("Error fetching pump revenue:", error);
      }
    };
    fetchRevenueData();
  }, []);

  const selectDatePumpRevenue = new Date(formattedSelectedDatePumpRevenue);
  const formatDatePumpRevenue = selectDatePumpRevenue.toLocaleDateString();
  const pumpRevenueData = revenueData.find(
    (entry) =>
      timeConverter(Date.parse(entry.date)).date === formatDatePumpRevenue
  ) || {
    items: [],
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);
  const indexOfLastStaff = currentPage * perPage;
  const indexOfFirstStaff = indexOfLastStaff - perPage;
  const displayedStaff = dailyData.slice(indexOfFirstStaff, indexOfLastStaff);
  const totalPages = Math.ceil(dailyData.length / perPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [currentPageRevenue, setCurrentPageRevenue] = useState(1);
  const [perPageRevenue] = useState(5);
  const indexOfLastRevenue = currentPageRevenue * perPageRevenue;
  const indexOfFirstRevenue = indexOfLastRevenue - perPageRevenue;
  const displayedRevenue = currentData.items.slice(
    indexOfFirstRevenue,
    indexOfLastRevenue
  );
  const totalPagesRevenue = Math.ceil(
    currentData.items.length / perPageRevenue
  );
  const handlePageChangeRevenue = (page) => {
    setCurrentPageRevenue(page);
  };

  const [currentPageLeft, setCurrentPageLeft] = useState(1);
  const [perPageLeft] = useState(4);
  const indexOfLastLeft = currentPageLeft * perPageLeft;
  const indexOfFirstLeft = indexOfLastLeft - perPageLeft;
  const displayedLeft = leftData.slice(indexOfFirstLeft, indexOfLastLeft);
  const totalPagesLeft = Math.ceil(leftData.length / perPageLeft);
  const handlePageChangeLeft = (page) => {
    setCurrentPageLeft(page);
  };

  const [currentPagePumpRevenue, setCurrentPagePumpRevenue] = useState(1);
  const [perPagePumpRevenue] = useState(4);
  const indexOfLastPumpRevenue = currentPagePumpRevenue * perPagePumpRevenue;
  const indexOfFirstPumpRevenue = indexOfLastPumpRevenue - perPagePumpRevenue;
  const displayedPumpRevenue = pumpRevenueData.items.slice(
    indexOfFirstPumpRevenue,
    indexOfLastPumpRevenue
  );
  const totalPagesPumpRevenue = Math.ceil(
    pumpRevenueData.items.length / perPagePumpRevenue
  );
  const handlePageChangePumpRevenue = (page) => {
    setCurrentPagePumpRevenue(page);
  };

  const [showOverlay, setShowOverlay] = useState(true);
  return (
    <div className="revenue">
      {/* {showOverlay && 
        <div className="overlay">
          <div className="loader">
            <svg className="circular" viewBox="25 25 50 50">
              <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10"/>
            </svg>
          </div>
        </div>} */}
      <div className="tilte_revenue">
        <h1>Chuyên gia Xăng dầu số hàng đầu Việt Nam</h1>
        <p>Chuyển đổi số hiệu quả, nâng cao năng suất hoạt động.</p>
      </div>
      <div className="Row">
        <div className="chartRevenue">
          <div className="title_xemChitiet Row">
            DOANH THU SẢN LƯỢNG
            <input
              className="inputRevenue"
              type="date"
              value={formattedSelectedDateRevenue}
              onChange={handleDateChangeRevenue}
            />
          </div>
          <div className="chart">
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
          <div className="button_xemChitiet">
            <button onClick={() => setShowBarDetail(true)}>Xem chi tiết</button>
          </div>
        </div>
        {showBarDetail && (
          <>
            <div
              className="overlay"
              onClick={() => setShowBarDetail(false)}
            ></div>
            <div className="viewShift">
              <AiOutlineClose
                className="close_icon"
                onClick={() => setShowBarDetail(false)}
              />
              <h4>Chi tiết Doanh thu Sản lượng</h4>
              <hr></hr>
              <div>
                <div className="date-selector">
                  <input
                    type="date"
                    value={formattedSelectedDateRevenue}
                    onChange={handleDateChangeRevenue}
                  />
                </div>
                <div className="content">
                  <h4>{formatDatestring(formattedDateRevenue)}</h4>
                  <div className="table-container">
                    <table className="table firsttable">
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Mặt hàng</th>
                          <th>Doanh thu</th>
                          <th>Sản lượng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedRevenue.length > 0 ? (
                          displayedRevenue.map((item, index) => (
                            <tr key={index}>
                              <td>{indexOfFirstRevenue + index + 1}</td>
                              <td>{item.productName}</td>
                              <td>{item.productRevenue}</td>
                              <td>{item.productQuantity}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="no-data">
                              Không có dữ liệu
                            </td>
                          </tr>
                        )}
                        {displayedRevenue.length > 0 && (
                          <tr>
                            <td colSpan="4" className="noLine">
                              <div className="pagination">
                                <p>
                                  <span>
                                    Đang hiển thị {indexOfFirstRevenue + 1} đến{" "}
                                    {Math.min(
                                      indexOfLastRevenue,
                                      currentData.items.length
                                    )}{" "}
                                    của {currentData.items.length} mục
                                  </span>
                                </p>
                                <ul className="pagination-list">
                                  <li
                                    className={`pagination-item ${
                                      currentPageRevenue === 1 ? "disabled" : ""
                                    }`}
                                  >
                                    <button
                                      onClick={() =>
                                        handlePageChangeRevenue(
                                          currentPageRevenue - 1
                                        )
                                      }
                                      disabled={currentPageRevenue === 1}
                                    >
                                      Previous
                                    </button>
                                  </li>
                                  {Array.from(
                                    { length: totalPagesRevenue },
                                    (_, index) => (
                                      <li
                                        key={index}
                                        className={`pagination-item ${
                                          currentPageRevenue === index + 1
                                            ? "active"
                                            : ""
                                        }`}
                                      >
                                        <button
                                          onClick={() =>
                                            handlePageChangeRevenue(index + 1)
                                          }
                                        >
                                          {index + 1}
                                        </button>
                                      </li>
                                    )
                                  )}
                                  <li
                                    className={`pagination-item ${
                                      currentPageRevenue === totalPagesRevenue
                                        ? "disabled"
                                        : ""
                                    }`}
                                  >
                                    <button
                                      onClick={() =>
                                        handlePageChangeRevenue(
                                          currentPageRevenue + 1
                                        )
                                      }
                                      disabled={
                                        currentPageRevenue === totalPagesRevenue
                                      }
                                    >
                                      Next
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <div className="chartRevenue">
          <div className="title_xemChitiet">TỒN KHO</div>
          <div className="chart">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
          <div className="button_xemChitiet">
            <button
              onClick={() => {
                setShowDoughnutDetail(true);
                setSelectedItem(true);
                if (leftData.length > 0) {
                  handleRowClick(leftData[0]);
                }
              }}
            >
              Xem chi tiết
            </button>
          </div>
        </div>
        {showDoughnutDetail && (
          <>
            <div
              className="overlay"
              onClick={() => setShowDoughnutDetail(false)}
            ></div>
            <div className="viewShift">
              <AiOutlineClose
                onClick={() => setShowDoughnutDetail(false)}
                className="close_icon"
              />
              <h4>TỒN KHO</h4>
              <hr />
              <div className="content">
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Bể</th>
                        <th>Thể tích bể</th>
                        <th>Mặt hàng tồn</th>
                        <th>Số lượng </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedLeft.length > 0 ? (
                        displayedLeft.map((item, index) => (
                          <tr key={index} onClick={() => handleRowClick(item)}>
                            <td>{indexOfFirstLeft + index + 1}</td>
                            <td>{item.tankName}</td>
                            <td>{item.tankVolume}</td>
                            <td>{item.product.productName}</td>
                            <td>{item.product.quantity_left}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="no-data">
                            Chưa có dữ liệu về tồn kho của bể
                          </td>
                        </tr>
                      )}
                      {displayedLeft.length > 0 && (
                        <tr>
                          <td colSpan="5" className="noLine">
                            <div className="pagination">
                              <p>
                                <span>
                                  Đang hiển thị {indexOfFirstLeft + 1} đến{" "}
                                  {Math.min(indexOfLastLeft, leftData.length)}{" "}
                                  của {leftData.length} mục
                                </span>
                              </p>
                              <ul className="pagination-list">
                                <li
                                  className={`pagination-item ${
                                    currentPageLeft === 1 ? "disabled" : ""
                                  }`}
                                >
                                  <button
                                    onClick={() =>
                                      handlePageChangeLeft(currentPageLeft - 1)
                                    }
                                    disabled={currentPageLeft === 1}
                                  >
                                    Previous
                                  </button>
                                </li>
                                {Array.from(
                                  { length: totalPagesLeft },
                                  (_, index) => (
                                    <li
                                      key={index}
                                      className={`pagination-item ${
                                        currentPageLeft === index + 1
                                          ? "active"
                                          : ""
                                      }`}
                                    >
                                      <button
                                        onClick={() =>
                                          handlePageChangeLeft(index + 1)
                                        }
                                      >
                                        {index + 1}
                                      </button>
                                    </li>
                                  )
                                )}
                                <li
                                  className={`pagination-item ${
                                    currentPageLeft === totalPagesLeft
                                      ? "disabled"
                                      : ""
                                  }`}
                                >
                                  <button
                                    onClick={() =>
                                      handlePageChangeLeft(currentPageLeft + 1)
                                    }
                                    disabled={
                                      currentPageLeft === totalPagesLeft
                                    }
                                  >
                                    Next
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {selectedItem && (
                    <>
                      <div className="pump_Revenue">
                        <Doughnut
                          data={{
                            labels: ["Thể tích bể", "Số lượng hàng tồn"],
                            datasets: [
                              {
                                label: "Tồn kho",
                                data: [
                                  selectedItem.tankVolume,
                                  selectedItem.product.quantity_left,
                                ],
                                backgroundColor: [
                                  "rgb(255, 99, 132)",
                                  "rgb(54, 162, 235)",
                                ],
                                hoverOffset: 1,
                              },
                            ],
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              title: {
                                display: true,
                                text: selectedItem.tankName,
                              },
                            },
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <br></br>
      <div className="Row">
        <div className="Column doanh_thu">
          <header className="headerRevenue">
            <p>DOANH THU VÒI BƠM</p>
            {/* <div className="search-container">
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
                value={searchQueryTank}
                onChange={(e) => setSearchQueryTank(e.target.value)}
               />
            </div> */}
            <div>
              <input
                type="date"
                value={formattedSelectedDatePumpRevenue}
                onChange={handleDateChangePumpRevenue}
              />
            </div>
          </header>
          <div className="doanh_thuTable">
            <table className="firsttable_shift">
              <thead>
                <tr className="titleOneline">
                  <th>STT</th>
                  <th>Vòi bơm</th>
                  <th>Mặt hàng</th>
                  <th>Số đầu - số cuối</th>
                </tr>
              </thead>
              <tbody>
                {displayedPumpRevenue.length > 0 ? (
                  displayedPumpRevenue.map((staffMember, index) => (
                    <tr key={staffMember.id} className="col" id="mainstate">
                      <td>{indexOfFirstPumpRevenue + index + 1}</td>
                      <td>{staffMember.pumpName}</td>
                      <td>{staffMember.productName}</td>
                      <td>
                        {staffMember.fNum} - {staffMember.lNum}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data">
                      Chưa có dữ liệu về doanh thu vòi bơm
                    </td>
                  </tr>
                )}
                {displayedPumpRevenue.length > 0 && (
                  <tr>
                    <td colSpan="5" className="noLine">
                      <div className="pagination">
                        <p>
                          <span>
                            Đang hiển thị {indexOfFirstPumpRevenue + 1} đến{" "}
                            {Math.min(
                              indexOfLastPumpRevenue,
                              pumpRevenueData.items.length
                            )}{" "}
                            của {pumpRevenueData.items.length} mục
                          </span>
                        </p>
                        <ul className="pagination-list">
                          <li
                            className={`pagination-item ${
                              currentPagePumpRevenue === 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              onClick={() =>
                                handlePageChangePumpRevenue(
                                  currentPagePumpRevenue - 1
                                )
                              }
                              disabled={currentPagePumpRevenue === 1}
                            >
                              Previous
                            </button>
                          </li>
                          {Array.from(
                            { length: totalPagesPumpRevenue },
                            (_, index) => (
                              <li
                                key={index}
                                className={`pagination-item ${
                                  currentPagePumpRevenue === index + 1
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <button
                                  onClick={() =>
                                    handlePageChangePumpRevenue(index + 1)
                                  }
                                >
                                  {index + 1}
                                </button>
                              </li>
                            )
                          )}
                          <li
                            className={`pagination-item ${
                              currentPagePumpRevenue === totalPagesPumpRevenue
                                ? "disabled"
                                : ""
                            }`}
                          >
                            <button
                              onClick={() =>
                                handlePageChangePumpRevenue(
                                  currentPagePumpRevenue + 1
                                )
                              }
                              disabled={
                                currentPagePumpRevenue === totalPagesPumpRevenue
                              }
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <br />
          <div className="row_image">
            <div className="object_body">
              <div className="object_box"> {staffNumber} </div>
              <Link className="object_a" to="/staff">
                <IoMdPeople />
                <span>NHÂN VIÊN</span>
              </Link>
            </div>
            <div className="object_body">
              <div className="object_box"> {productNumber} </div>
              <Link to="/product" className="object_a">
                <AiOutlineProduct />
                <span>MẶT HÀNG</span>
              </Link>
            </div>
            <div className="object_body">
              <div className="object_box"> {pumpNumber} </div>
              <Link to="/pump" className="object_a">
                <PiGasPumpBold />
                <span>VÒI BƠM</span>
              </Link>
            </div>
            <div className="object_body">
              <div className="object_box"> {tankNumber} </div>
              <Link to="/tank" className="object_a">
                <GiFuelTank />
                <span> BỂ </span>
              </Link>
            </div>
          </div>
        </div>
        <div className="ton_kho">
          <div className="containerRevenue">
            <h6>LƯỢNG TỒN TRONG CA</h6>
            <hr />
            <div className="date-selector">
              <input
                type="date"
                id="date"
                value={formattedSelectedDateLog}
                onChange={handleDateChangeLog}
              />
            </div>
            <div className="content">
              <h4>{formatDatestring(formattedDateLog)}</h4>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Giờ phát sinh</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedStaff.length > 0 ? (
                      displayedStaff.map((item, index) => (
                        <tr key={index}>
                          <td>
                            {timeConverter(Date.parse(item.startTime)).time}
                          </td>
                          <td>{item.totalAmount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="no-data">
                          Không có dữ liệu về log phát sinh
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    {displayedStaff.length > 4 ? (
                      <tr>
                        <td className="center_sum" colSpan={2}>
                          ....
                        </td>
                      </tr>
                    ) : null}
                    {displayedStaff.length > 0 ? (
                      <tr>
                        <th className="left_sum">Tổng:</th>
                        <th className="right_sum" colSpan={5}>
                          {total.toLocaleString("vi-VN")}
                        </th>
                      </tr>
                    ) : null}
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
          <div
            className="button_xemChitiet borders"
            onClick={() => setLogExists(true)}
          >
            <button>Xem chi tiết</button>
          </div>
          {logExists && (
            <>
              <div
                className="overlay"
                onClick={() => setLogExists(false)}
              ></div>
              <div className="viewShift">
                <AiOutlineClose
                  onClick={() => setLogExists(false)}
                  className="close_icon"
                />
                <h4>LƯỢNG TỒN TRONG CA</h4>
                <hr />
                <div>
                  <div className="date-selector">
                    <input
                      type="date"
                      id="date"
                      value={formattedSelectedDateLog}
                      onChange={handleDateChangeLog}
                    />
                  </div>
                  <div className="content">
                    <h4>{formatDatestring(formattedDateLog)}</h4>
                    <div className="table-container">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Giờ phát sinh</th>
                            <th>Mặt hàng</th>
                            <th>Vòi bơm</th>
                            <th>Đơn giá</th>
                            <th>Số lượng</th>
                            <th>Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedStaff.length > 0 ? (
                            displayedStaff.map((item, index) => (
                              <tr key={index}>
                                <td>
                                  {
                                    timeConverter(Date.parse(item.startTime))
                                      .time
                                  }
                                </td>
                                <td>{item.productName}</td>
                                <td>{item.pumpName}</td>
                                <td>{item.productPrice}</td>
                                <td>{item.quantity}</td>
                                <td>{item.totalAmount}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="no-data">
                                Không có dữ liệu về log phát sinh
                              </td>
                            </tr>
                          )}
                        </tbody>
                        <tfoot>
                          {displayedStaff.length > 4 ? (
                            <tr>
                              <td colSpan={6} className="center_sum">
                                {" "}
                                .....
                              </td>
                            </tr>
                          ) : null}
                          {displayedStaff.length > 0 ? (
                            <tr>
                              <td className="left_sum">Tổng:</td>
                              <td className="right_sum" colSpan={5}>
                                {total.toLocaleString("vi-VN")}
                              </td>
                            </tr>
                          ) : null}
                        </tfoot>
                      </table>
                    </div>
                    {displayedStaff.length > 0 && (
                      <div className="pagination">
                        <p>
                          <span>
                            Đang hiển thị {indexOfFirstStaff + 1} đến{" "}
                            {Math.min(indexOfLastStaff, dailyData.length)} của{" "}
                            {dailyData.length} mục
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
                              <button
                                onClick={() => handlePageChange(index + 1)}
                              >
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
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Revenue;
