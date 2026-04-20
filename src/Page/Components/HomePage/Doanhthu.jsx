import { useEffect, useState, useCallback, useMemo } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);
import "chart.js/auto";
import "./Revenue.css";
import useFetchLog from "../../../hooks/FetchHooks/useFetchLog.js";
import { timeConverter } from "../../../utils/timeConverter.js";
import { AiOutlineClose, AiOutlineProduct } from "react-icons/ai";
import { GiFuelTank } from "react-icons/gi";
import { PiGasPumpBold } from "react-icons/pi";
import { IoMdPeople } from "react-icons/io";
import { Link } from "react-router-dom";
import useFetchRevenue from "../../../hooks/FetchHooks/useFetchRevenue.js";
import useFetchPumpRevenue from "../../../hooks/FetchHooks/useFetchPumpRevenue.js";
import useTankStore from "../../../store/tankStore.js";
import useProductStore from "../../../store/productStore.js";
import usePumpStore from "../../../store/pumpStore.js";
import useStaffStore from "../../../store/staffStore.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import useLogout from "../../../hooks/useLogout";
import { useTranslation } from "react-i18next";

const Revenue = () => {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language.startsWith("fi") ? "fi-FI" : "vi-VN";
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
  const [logData, setLogData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [total, setTotal] = useState(0);
  const [logExists, setLogExists] = useState(false);
  const [showBarDetail, setShowBarDetail] = useState(false);
  const [showDoughnutDetail, setShowDoughnutDetail] = useState(false);
  const [leftData, setLeftData] = useState([]);

  const navigate = useNavigate();
  const { handleLogout } = useLogout();
  const handleDateChangeLog = (e) => {
    setSelectedDateLog(e);
  };

  const handleDateChangeRevenue = (e) => {
    setSelectedDateRevenue(e);
  };

  const handleDateChangePumpRevenue = (e) => {
    setSelectedDatePumpRevenue(e);
  };

  const formattedDateLog = selectedDateLog.toLocaleDateString(dateLocale, {
    month: "numeric",
    year: "numeric",
    day: "numeric",
  });

  const formattedDateRevenue = selectedDateRevenue.toLocaleDateString(dateLocale, {
    month: "numeric",
    year: "numeric",
    day: "numeric",
  });

  const formatDatestring = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return t("date.longDate", { day, month, year });
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
      setLogData(result);
      if (result.Status !== "error") {
        const logs = result.filter((log) => {
          const logDate = new Date(log.startTime).toISOString().slice(0, 10);
          return logDate === formattedSelectedDateLog;
        });
        setDailyData(logs);
        setTotal(
          logs.reduce(
            (sum, item) =>
              sum + parseInt(item.totalAmount ? item.totalAmount : 0),
            0
          )
        );
      }
    };
    fetchLogs();
  }, [formattedSelectedDateLog, useFetchLog]);

  const [selectedItem, setSelectedItem] = useState([null]);

  useEffect(() => {
    const fetchData = async () => {
      setLeftData(tanks);
      if (tanks.length > 0) {
        setSelectedItem(tanks[0]);
      }
    };
    fetchData();
  }, [tanks]);

  const handleRowClick = useCallback((item) => {
    setSelectedItem(item);
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

  const barData = useMemo(
    () => ({
      labels: currentData.items.map((item) => item.productName),
      datasets: [
        {
          label: t("charts.revenue"),
          data: currentData.items.map((item) => item.productRevenue),
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
        {
          label: t("charts.volume"),
          data: currentData.items.map((item) => item.productQuantity),
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    }),
    [currentData.items, t]
  );
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
  let displayedLog = dailyData.slice(indexOfFirstStaff, indexOfLastStaff);
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

  const highlightDatesRevenue = dataRevenue.map((date) => new Date(date.date));
  const highlightDatesPumpRevenue = revenueData.map(
    (date) => new Date(date.date)
  );
  const highlightDatesLog = logData.map((date) => new Date(date.startTime));

  const formatNumberWithCommas = (number) => {
    number = number ? number : 0;
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const formatLabel = (value, unit) => `${value} ${unit}`;

  const [displayDataLabels, setDisplayDataLabels] = useState(true);

  const updateDataLabelDisplay = () => {
    setDisplayDataLabels(window.innerWidth >= 768);
  };

  useEffect(() => {
    updateDataLabelDisplay();
    window.addEventListener("resize", updateDataLabelDisplay);
    return () => window.removeEventListener("resize", updateDataLabelDisplay);
  }, []);

  const [logoutTimer, setLogoutTimer] = useState(null);
  useEffect(() => {
    startLogoutTimer();
    return () => {
      clearTimeout(logoutTimer);
    };
  }, []);

  const startLogoutTimer = () => {
    localStorage.setItem("lastActivity", new Date().getTime());

    const timer = setTimeout(logout, 4 * 60 * 60 * 1000);
    setLogoutTimer(timer);
  };

  const logout = () => {
    handleLogout();
    navigate("/auth");
  };
  return (
    <div className="revenue">
      <div className="tilte_revenue" style={{ textAlign: "center" }}>
        <h1>{t("dashboard.title")}</h1>
        <p>{t("dashboard.subtitle")}</p>
      </div>
      <div className="Row">
        <div className="chartRevenue">
          <div className="title_xemChitiet Row">
            <p>{t("dashboard.revenueVolumeTitle")}</p>
            <div>
              <DatePicker
                selected={selectedDateRevenue}
                onChange={handleDateChangeRevenue}
                value={selectedDateRevenue}
                dateFormat="yyyy-MM-dd"
                className="inputRevenue customDatePicker"
                highlightDates={highlightDatesRevenue}
                shouldHighlightWeekends
              />
            </div>
          </div>
          <div className="chart">
            <div className="over">
              {loading ? (
                <div className="loader">
                  <svg className="circular" viewBox="25 25 50 50">
                    <circle
                      className="path"
                      cx="50"
                      cy="50"
                      r="20"
                      fill="none"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                    />
                  </svg>
                </div>
              ) : currentData.items.length > 0 ? (
                <Bar
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const label = context.dataset.label || "";
                            const value = context.raw || 0;
                            const unit =
                              context.datasetIndex === 0 ? "VND" : "L";
                            return `${label}: ${formatNumberWithCommas(
                              value
                            )} ${unit}`;
                          },
                        },
                      },
                      datalabels: {
                        display: displayDataLabels,
                        formatter: (value, context) => {
                          const unit =
                            context.datasetIndex === 0 ? "VND" : "L";
                          return `${formatNumberWithCommas(value)} ${unit}`;
                        },
                        anchor: "end",
                        align: "top",
                        offset: -5,
                        font: {
                          size: 12,
                          weight: "bold",
                          color: "white",
                        },
                        clip: true,
                      },
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                      },
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              ) : (
                <div className="no-data">{t("common.noData")}</div>
              )}
            </div>
          </div>
          <div className="button_xemChitiet">
            <button onClick={() => setShowBarDetail(true)}>{t("common.detail")}</button>
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
              <h4>{t("dashboard.revenueDetailTitle")}</h4>
              <hr></hr>
              <div>
                <div className="date-selector">
                  <DatePicker
                    selected={selectedDateRevenue}
                    onChange={handleDateChangeRevenue}
                    value={selectedDateRevenue}
                    dateFormat="yyyy-MM-dd"
                    className="inputRevenue customDatePicker"
                    highlightDates={highlightDatesRevenue}
                    shouldHighlightWeekends
                  />
                </div>
                <div className="content">
                  <h4>{formatDatestring(formattedDateRevenue)}</h4>
                  <div className="table-container">
                    <table className="firsttable_shift">
                      <thead className="theadRevenue">
                        <tr>
                          <th className="center_sum">{t("tables.stt")}</th>
                          <th>{t("tables.product")}</th>
                          <th className="right_sum">{t("tables.revenue")}</th>
                          <th className="right_sum">{t("tables.volume")}</th>
                        </tr>
                      </thead>
                      <tbody className="tbodyRevenue">
                        {displayedRevenue.length > 0 ? (
                          displayedRevenue.map((item, index) => (
                            <tr key={index} className="empty">
                              <th className="center_sum">
                                {indexOfFirstRevenue + index + 1}
                              </th>
                              <td data-title={t("tables.product")}>
                                {item.productName}
                              </td>
                              <td
                                className="right_sum"
                                data-title={t("tables.revenue")}
                              >
                                {formatNumberWithCommas(item.productRevenue)}{" "}
                                VND
                              </td>
                              <td
                                className="right_sum"
                                data-title={t("tables.volume")}
                              >
                                {formatNumberWithCommas(item.productQuantity)} L
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="center_sum">
                              {t("messages.noData")}
                            </td>
                          </tr>
                        )}
                        {displayedRevenue.length > 0 && (
                          <tr>
                            <td colSpan="4" className="noLine">
                              <div className="pagination">
                                <p>
                                  <span>
                                    {t("pagination.revenueRows", {
                                      from: indexOfFirstRevenue + 1,
                                      to: Math.min(
                                        indexOfLastRevenue,
                                        currentData.items.length
                                      ),
                                      total: currentData.items.length,
                                    })}
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
                                      {t("common.previous")}
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
                                      {t("common.next")}
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
          <div className="title_xemChitiet">
            {t("dashboard.inventoryTitle")}
          </div>
          <div className="chart">
            <div className="over">
              {loading ? (
                <div className="loader">
                  <svg className="circular" viewBox="25 25 50 50">
                    <circle
                      className="path"
                      cx="50"
                      cy="50"
                      r="20"
                      fill="none"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                    />
                  </svg>
                </div>
              ) : tanks.length > 0 ? (
                <Doughnut
                  data={{
                    labels: [
                      t("charts.emptyTankSpace"),
                      t("charts.stockQuantity"),
                    ],
                    datasets: [
                      {
                        label: t("charts.inventory"),
                        data: [
                          (selectedItem.tankVolume ?? 0) -
                            (selectedItem.product?.quantity_left ?? 0),
                          selectedItem.product?.quantity_left ?? 0,
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
                        text: selectedItem.tankName ?? null,
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const label = context.label || "";
                            const value = context.raw || "";
                            return `${label}: ${formatLabel(
                              formatNumberWithCommas(value),
                              "L"
                            )}`;
                          },
                        },
                      },
                      datalabels: {
                        formatter: (value, context) => {
                          return formatLabel(
                            formatNumberWithCommas(value),
                            "L"
                          );
                        },
                        color: "#000000",
                      },
                    },
                  }}
                />
              ) : (
                <div className="no-data">{t("common.noData")}</div>
              )}
            </div>
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
              {t("common.detail")}
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
              <h4>{t("dashboard.inventoryTitle")}</h4>
              <hr />
              <div className="content">
                <div className="table-container">
                  <table className="firsttable_shift">
                    <thead className="theadRevenue">
                      <tr>
                        <th className="center_sum">{t("tables.stt")}</th>
                        <th>{t("tables.tankAndProduct")}</th>
                        <th className="right_sum">{t("tables.tankVolume")}</th>
                        {/* <th className="right_sum">Mặt hàng</th> */}
                        <th className="right_sum">{t("tables.stockOnHand")}</th>
                      </tr>
                    </thead>
                    <tbody className="tbodyRevenue">
                      {displayedLeft.length > 0 ? (
                        displayedLeft.map((item, index) => (
                          <tr
                            key={index}
                            className="empty"
                            onClick={() => handleRowClick(item)}
                          >
                            <th
                              className="center_sum noneRevenue"
                              data-label={t("tables.stt")}
                            >
                              {indexOfFirstLeft + index + 1}
                            </th>
                            <td className="noneRevenue">{item.tankName}</td>
                            <td
                              className="right_sum"
                              data-label={item.tankName}
                              data-title={t("tables.tank")}
                            >
                              {formatNumberWithCommas(item.tankVolume)} L
                            </td>
                            {/* <td className="noneRevenue right_sum">
                              {item.product.productName}
                            </td> */}
                            <td
                              className="right_sum"
                              data-label={item.product.productName}
                              data-title={t("tables.product")}
                            >
                              {formatNumberWithCommas(
                                item.product.quantity_left
                              )}{" "}
                              L
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="center_sum">
                            {t("messages.noTankStockData")}
                          </td>
                        </tr>
                      )}
                      {displayedLeft.length > 0 && (
                        <tr>
                          <td colSpan="5" className="noLine">
                            <div className="pagination">
                              <p>
                                <span>
                                  {t("pagination.tankRows", {
                                    from: indexOfFirstLeft + 1,
                                    to: Math.min(
                                      indexOfLastLeft,
                                      leftData.length
                                    ),
                                    total: leftData.length,
                                  })}
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
                                    {t("common.previous")}
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
                                    {t("common.next")}
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
                            labels: [
                              t("charts.emptyTankSpace"),
                              t("charts.stockQuantity"),
                            ],
                            datasets: [
                              {
                                label: t("charts.inventory"),
                                data: [
                                  (selectedItem.tankVolume ?? 0) -
                                    (selectedItem.product?.quantity_left ?? 0),
                                  selectedItem.product?.quantity_left ?? 0,
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
                                text: selectedItem.tankName ?? null,
                              },
                              tooltip: {
                                callbacks: {
                                  label: function (context) {
                                    const label = context.label || "";
                                    const value = context.raw || "";
                                    return `${label}: ${formatLabel(
                                      formatNumberWithCommas(value),
                                      "L"
                                    )}`;
                                  },
                                },
                              },
                              datalabels: {
                                formatter: (value, context) => {
                                  return formatLabel(
                                    formatNumberWithCommas(value),
                                    "L"
                                  );
                                },
                                color: "#000000",
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
            <p>{t("dashboard.pumpRevenueTitle")}</p>
            <div>
              <DatePicker
                selected={selectedDatePumpRevenue}
                onChange={handleDateChangePumpRevenue}
                value={selectedDatePumpRevenue}
                dateFormat="yyyy-MM-dd"
                className="inputRevenue customDatePicker"
                highlightDates={highlightDatesPumpRevenue}
                shouldHighlightWeekends
              />
            </div>
          </header>
          <div className="doanh_thuTable ">
            <table className="firsttable_shift">
              <thead className="theadRevenue">
                <tr>
                  <th className="center_sum">{t("tables.stt")}</th>
                  <th>{t("tables.pumpAndProduct")}</th>
                  {/* <th>Mặt hàng</th> */}
                  <th className="right_sum">{t("tables.startReading")}</th>
                  <th className="right_sum">{t("tables.endReading")}</th>
                  <th className="right_sum">{t("tables.revenue")}</th>
                </tr>
              </thead>
              <tbody className="tbodyRevenue">
                {displayedPumpRevenue.length > 0 ? (
                  displayedPumpRevenue.map((staffMember, index) => (
                    <tr
                      key={staffMember.id || index}
                      className="empty"
                      id="mainstate"
                    >
                      <th className="center_sum">
                        {indexOfFirstPumpRevenue + index + 1}
                      </th>
                      <td data-title={t("tables.pump")}>
                        {staffMember.pumpName}
                      </td>
                      {/* <td data-title="Mặt hàng">{staffMember.productName}</td> */}
                      <td
                        className="right_sum"
                        data-title={t("tables.startReading")}
                      >
                        {formatNumberWithCommas(staffMember.fNum)}
                      </td>
                      <td
                        className="right_sum"
                        data-title={t("tables.endReading")}
                      >
                        {formatNumberWithCommas(staffMember.lNum)}
                      </td>
                      <td
                        className="right_sum"
                        data-title={t("tables.revenue")}
                      >
                        {formatNumberWithCommas(
                          staffMember.lNum - staffMember.fNum
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="center_sum">
                      {t("messages.noPumpRevenueData")}
                    </td>
                  </tr>
                )}
                {displayedPumpRevenue.length > 0 && (
                  <tr>
                    <td colSpan="5" className="noLine">
                      <div className="pagination">
                        <p>
                          <span>
                            {t("pagination.pumpRows", {
                              from: indexOfFirstPumpRevenue + 1,
                              to: Math.min(
                                indexOfLastPumpRevenue,
                                pumpRevenueData.items.length
                              ),
                              total: pumpRevenueData.items.length,
                            })}
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
                              {t("common.previous")}
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
                              {t("common.next")}
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
            <div className="object_body staffRevenue">
              <div className="object_box"> {staffNumber} </div>
              <Link className="object_a" to="/staff">
                <IoMdPeople />
                <span>{t("nav.staff")}</span>
              </Link>
            </div>
            <div className="object_body">
              <div className="object_box"> {productNumber} </div>
              <Link to="/product" className="object_a">
                <AiOutlineProduct />
                <span>{t("nav.product")}</span>
              </Link>
            </div>
            <div className="object_body">
              <div className="object_box"> {pumpNumber} </div>
              <Link to="/pump" className="object_a">
                <PiGasPumpBold />
                <span>{t("nav.pump")}</span>
              </Link>
            </div>
            <div className="object_body">
              <div className="object_box"> {tankNumber} </div>
              <Link to="/tank" className="object_a">
                <GiFuelTank />
                <span> {t("nav.tank")} </span>
              </Link>
            </div>
          </div>
        </div>
        <div className="ton_kho">
          <div className="containerRevenue">
            <h6>{t("dashboard.shiftLogTitle")}</h6>
            <hr />
            <div className="date-selector">
              <DatePicker
                selected={selectedDateLog}
                onChange={handleDateChangeLog}
                value={selectedDateLog}
                dateFormat="yyyy-MM-dd"
                className="inputRevenue customDatePicker"
                highlightDates={highlightDatesLog}
                shouldHighlightWeekends
              />
            </div>
            <div className="content">
              <h4 className="timeLog">{formatDatestring(formattedDateLog)}</h4>
              <div className="table-container">
                <table className="firsttable_shift">
                  <thead>
                    <tr>
                      <th className="center_sum">{t("tables.timeOccurred")}</th>
                      <th className="right_sum">{t("tables.amount")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedLog.length > 0 ? (
                      displayedLog.map((item, index) => (
                        <tr key={index}>
                          <td className="center_sum">
                            {timeConverter(Date.parse(item.startTime)).time}
                          </td>
                          <td className="right_sum">
                            {" "}
                            {formatNumberWithCommas(item.totalAmount)} VND
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="center_sum">
                          {t("messages.noLogData")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    {displayedLog.length > 4 ? (
                      <tr>
                        <td className="center_sum" colSpan={2}>
                          ....
                        </td>
                      </tr>
                    ) : null}
                    {displayedLog.length > 0 ? (
                      <tr>
                        <th className="left_sum">{t("tables.total")}</th>
                        <th className="right_sum" colSpan={5}>
                          {formatNumberWithCommas(
                            total.toLocaleString(dateLocale)
                          )}{" "}
                          VND
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
            <button>{t("common.detail")}</button>
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
                <h4>{t("dashboard.logDetailTitle")}</h4>
                <hr />
                <div>
                  <div className="date-selector">
                    <DatePicker
                      selected={selectedDateLog}
                      onChange={handleDateChangeLog}
                      value={selectedDateLog}
                      dateFormat="yyyy-MM-dd"
                      className="inputRevenue customDatePicker"
                      highlightDates={highlightDatesLog}
                      shouldHighlightWeekends
                    />
                  </div>
                  <div className="content">
                    <h4>{formatDatestring(formattedDateLog)}</h4>
                    <div className="table-container">
                      <table className="firsttable_shift">
                        <thead className="theadRevenue">
                          <tr>
                            <th className="center_sum">
                              {t("tables.timeOccurred")}
                            </th>
                            <th>{t("tables.product")}</th>
                            <th>{t("tables.pump")}</th>
                            <th className="right_sum">{t("tables.unitPrice")}</th>
                            <th className="right_sum">{t("tables.quantity")}</th>
                            <th className="right_sum">{t("tables.amount")}</th>
                          </tr>
                        </thead>
                        <tbody className="tbodyRevenue">
                          {displayedLog.length > 0 ? (
                            displayedLog.map((item, index) => (
                              <tr key={index} className="empty">
                                <td
                                  className="center_sum"
                                  data-title={t("tables.timeOccurred")}
                                >
                                  {
                                    timeConverter(Date.parse(item.startTime))
                                      .time
                                  }
                                </td>
                                <td data-title={t("tables.product")}>
                                  {item.productName}
                                </td>
                                <td data-title={t("tables.pump")}>
                                  {item.pumpName}
                                </td>
                                <td
                                  className="right_sum"
                                  data-title={t("tables.unitPrice")}
                                >
                                  {formatNumberWithCommas(item.productPrice)}{" "}
                                  VND
                                </td>
                                <td
                                  className="right_sum"
                                  data-title={t("tables.quantity")}
                                >
                                  {item.quantity}
                                </td>
                                <td
                                  className="right_sum"
                                  data-title={t("tables.amount")}
                                >
                                  {formatNumberWithCommas(item.totalAmount)} VND
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="6"
                                className="center_sum
        "
                              >
                                {t("messages.noLogData")}
                              </td>
                            </tr>
                          )}
                        </tbody>
                        <tfoot className="tbodyRevenue">
                          {displayedLog.length > 4 ? (
                            <tr>
                              <td colSpan={6} className="center_sum">
                                {" "}
                                .....
                              </td>
                            </tr>
                          ) : null}
                          {displayedLog.length > 0 ? (
                            <tr>
                              <th className="left_sum" colSpan={5}>
                                {t("tables.total")}
                              </th>
                              <td
                                className="right_sum"
                                data-title={t("tables.totalMoney")}
                              >
                                {total.toLocaleString(dateLocale)} VND
                              </td>
                            </tr>
                          ) : null}
                        </tfoot>
                      </table>
                    </div>
                    {displayedLog.length > 0 && (
                      <div className="pagination">
                        <p>
                          <span>
                            {t("pagination.logRows", {
                              from: indexOfFirstStaff + 1,
                              to: Math.min(indexOfLastStaff, dailyData.length),
                              total: dailyData.length,
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
                              {t("common.next")}
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
