import { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import "chart.js/auto";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { TbEyeEdit } from "react-icons/tb";
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
import useFetchLeft from "../../../hooks/FetchHooks/useFetchLeft.js";
import useFetchPumpRevenue from "../../../hooks/FetchHooks/useFetchPumpRevenue.js";

import useTankStore from '../../../store/tankStore.js';
import useProductStore from "../../../store/productStore.js";
import usePumpStore from "../../../store/pumpStore.js";
import useStaffStore from "../../../store/staffStore.js";
export const Revenue = () => {
  const { product, fetchProduct } = useProductStore();
  const { staff, fetchStaff } = useStaffStore();
  const { pumps, fetchPump } = usePumpStore();
  const { tanks, fetchTank } = useTankStore();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedSelectedDate = selectedDate.toISOString().slice(0, 10);
  const [dailyData, setDailyData] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [logExists, setLogExists] = useState(false);
  const [showBarDetail, setShowBarDetail] = useState(false);
  const [showDoughnutDetail, setShowDoughnutDetail] = useState(false);

  const [leftData, setLeftData] = useState([]);

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
  };

  const formattedDate = selectedDate.toLocaleDateString("vi-VN", {
    month: "numeric",
    year: "numeric",
    day: "numeric"
  });

  const formatDatestring = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `Ngày ${day} tháng ${month} năm ${year}`;
  };
  
  useEffect(() => {
      fetchProduct();
      fetchTank();
      fetchPump();
      fetchStaff();
  }, [fetchProduct, fetchTank, fetchPump, fetchStaff]);

  const staffNumber = staff.filter((staffMember) => staffMember.workingStatus === "IS WORKING").length;
  const productNumber = product.filter((staffMember) => staffMember.productStatus === "ON SALE").length;
  const pumpNumber = pumps.filter((staffMember) => staffMember.pumpStatus === "ON USE").length;
  const tankNumber = tanks.filter((staffMember) => staffMember.tankStatus === "ON USE").length;

  useEffect(() => {
    const fetchLogs = async () => {
      const result = await useFetchLog();
      if (result.Status !== "error") {
        const logs = result.filter(log => {
          const logDate =new Date(log.startTime).toISOString().slice(0, 10);  
          return logDate === formattedSelectedDate;
        });
        setDailyData(logs);
        setTotal(logs.reduce((sum, item) => sum + parseInt(item.totalAmount), 0));
      }
    };
    fetchLogs();
  }, [formattedSelectedDate]);

  // Tồn kho
  useEffect(() => {
    const fetchData = async () => {
      const result = await useFetchLeft();
      setLeftData(result);
      const totalQuantity = result.reduce(
        (sum, item) => sum + parseInt(item.leftProduct.productQuantity),
        0
      );
      const totalIncome = result.reduce(
        (sum, item) => sum + parseInt(item.leftTank.tankVolume),
        0
      );
      setTotalIncome(totalIncome);
      setTotalQuantity(totalQuantity);
    };
    fetchData();
  }, []);

  const doughnutData = {
    labels: ["Thể tích bể", "Số lượng hàng tồn"],
    datasets: [
      {
        label: "Tồn kho",
        data: [totalQuantity, totalIncome],
        backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
        hoverOffset: 10,
      },
    ],
  };

  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Doanh thu va san luong
  const [Datarevenue, setDataRevenue] = useState([]);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const revenueList = await useFetchRevenue();
        setDataRevenue(revenueList);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchRevenueData();
  }, []);

  const currentDate =new Date(new Date().toISOString().slice(0, 10));
  const fomartCurrent = currentDate.toLocaleDateString("vi-VN", {
      month: "numeric",
      year: "numeric",
      day: "numeric"
    });

  const currentData = Datarevenue.find((entry) => timeConverter(Date.parse(entry.date)).date === fomartCurrent) || {
    items: [],
  };

  const selectDate = new Date(formattedSelectedDate);
  const formatDate = selectDate.toLocaleDateString("vi-VN", {
    month: "numeric",
    year: "numeric",
    day: "numeric"
  });
  const detailedData = Datarevenue.find(
    (entry) => timeConverter(Date.parse(entry.date)).date === formatDate
  ) || { items: [] };

  // console.log(currentData);
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
        const revenueList = await useFetchPumpRevenue();
        setRevenueData(revenueList);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchRevenueData();
  }, []);

  const [selectedItem, setSelectedItem] = useState(null);

  const handleRowClick = (item) => {
    setSelectedItem(item);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const indexOfLastStaff = currentPage * perPage;
  const indexOfFirstStaff = indexOfLastStaff - perPage;
  const displayedStaff = dailyData.slice(indexOfFirstStaff, indexOfLastStaff);

  // console.log(dailyData)
  const totalPages = Math.ceil(dailyData.length / perPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
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
        <div className="barChart">
          <div className="title_xemChitiet">DOANH THU SẢN LƯỢNG</div>
          <Bar
            data={barData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
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
                    value={formattedSelectedDate}
                    onChange={handleDateChange}
                  />
                </div>
                <div className="content">
                  <h4>{formatDatestring(formattedDate)}</h4>
                  <div className="table-container">
                    <table className="table firsttable">
                      <thead>
                        <tr>
                          <th>Mặt hàng</th>
                          <th>Doanh thu</th>
                          <th>Sản lượng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailedData.items.length > 0 ? (
                          detailedData.items.map((item, index) => (
                            <tr key={index}>
                              <td>{item.productName}</td>
                              <td>{item.productRevenue}</td>
                              <td>{item.productQuantity}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="no-data">
                              Không có dữ liệu
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
        <div className="doughnutChart">
          <div className="title_xemChitiet">TỒN KHO</div>
          <Doughnut
            data={doughnutData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
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
                <div className="table-container row_pump">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Bể</th>
                        <th>Thể tích bể</th>
                        <th>Mặt hàng tồn</th>
                        <th>Số lượng </th>
                      </tr>
                    </thead>
                    <tbody>
                      {leftData.map((item, index) => (
                        <tr key={index} onClick={() => handleRowClick(item)}>
                          <td>{item.leftTank.tankName}</td>
                          <td>{item.leftTank.tankVolume}</td>
                          <td>{item.leftProduct.productName}</td>
                          <td>{item.leftProduct.productQuantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {selectedItem && (
                    <>
                      <div style={{ height: 300 + "px", width: 300 + "px" }}>
                        <Doughnut
                          data={{
                            labels: ["Thể tích bể", "Số lượng hàng tồn"],
                            datasets: [
                              {
                                label: "Tồn kho",
                                data: [
                                  selectedItem.leftTank.tankVolume,
                                  selectedItem.leftProduct.productQuantity,
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

      <br />
      <br />
      <br />


      <div className="Row">
        <div className="Column doanh_thu">
          <header>
            <p>DOANH THU VÒI BƠM</p>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
              />
            </div>
          </header>

          <div className="doanh_thuTable">
            <table className="firsttable_shift">
              <thead>
                <tr className="titleOneline">
                  <th className="right">Vòi bơm</th>
                  <th className="right">Mặt hàng</th>
                  <th className="right">Số đầu - số cuối</th>
                </tr>
              </thead>
              <tbody>
                {revenueData.map((staffMember) => (
                  <tr key={staffMember.pid} className="col" id="mainstate">
                    <td className="right">{staffMember.pumpName}</td>
                    <td className="right">{staffMember.productName}</td>
                    <td className="right">
                      {staffMember.fNum} - {staffMember.lNum}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
                <br />
          <div className="Row row_image">
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
        <div className="Column ton_kho">
          <div className="container">
            <h6>LƯỢNG TỒN TRONG CA</h6>
            <hr />
            <div className="date-selector">
              <input
                type="date"
                id="date"
                value={formattedSelectedDate}
                onChange={handleDateChange}
              />
            </div>

            <div className="content">
              <h4>{formatDatestring(formattedDate)}</h4>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Giờ phát sinh</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyData &&
                      dailyData.map((item, index) => (
                        <tr key={index}>
                          <td>
                            {timeConverter(Date.parse(item.startTime)).time}
                          </td>
                          <td>{item.totalAmount}</td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="left_sum"> Tổng: </td>
                      <td className="right_sum">
                        {total.toLocaleString("vi-VN")}
                      </td>
                    </tr>
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
                      value={formattedSelectedDate}
                      onChange={handleDateChange}
                    />
                  </div>

                  <div className="content">
                    <h4>{formatDatestring(formattedDate)}</h4>
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
                          {dailyData &&
                            dailyData.map((item, index) => (
                              <tr key={index}>
                                <td>
                                  {
                                    timeConverter(Date.parse(item.startTime)).time
                                  }
                                </td>
                                <td>{item.productName}</td>
                                <td>{item.pumpName}</td>
                                <td>{item.productPrice}</td>
                                <td>{item.quantity}</td>
                                <td>{item.totalAmount}</td>
                              </tr>
                            ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <th className="left_sum"> Tổng: </th>
                            <th className="right_sum" colSpan={5}>
                              {total.toLocaleString("vi-VN")}
                            </th>
                          </tr>
                        </tfoot>
                      </table>
                      {displayedStaff.length > 0 && (
                        <div className="pagination">
                          <p>
                            <span>Showing &nbsp;</span> <span>{indexOfFirstStaff + 1}&nbsp;</span><span>to&nbsp;</span><span>{Math.min(indexOfLastStaff, displayedStaff.length)}&nbsp;</span> <span>of&nbsp;</span> <span>{displayedStaff.length}&nbsp;</span> entries
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
