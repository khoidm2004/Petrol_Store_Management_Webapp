import { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import "chart.js/auto";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { TbEyeEdit } from "react-icons/tb";
import usePumpStore from "../../../store/pumpStore.js";
import "./Revenue.css";
import useFetchLog from "../../../hooks/useFetchLog.js";
import { timeConverter } from "../../../utils/timeConverter.js";
import { AiOutlineClose } from "react-icons/ai";
import { GiFuelTank } from "react-icons/gi";
import { PiGasPumpBold } from "react-icons/pi";
import { AiOutlineProduct } from "react-icons/ai";
import { IoMdPeople } from "react-icons/io";
import { Routes, Route, Link, useLocation } from "react-router-dom";

export const Revenue = () => {
  const pumps = usePumpStore((state) => state.pumps);
  const fetchPump = usePumpStore((state) => state.fetchPump);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedSelectedDate = selectedDate.toISOString().slice(0, 10);
  const [dailyData, setDailyData] = useState([]);
  const [total, setTotal] = useState(0);
  const [logExists, setLogExists] = useState(false);

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
  };

  const formattedDate = selectedDate.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }); 

  useEffect(() => {
    fetchPump();
  }, [fetchPump]);

  useEffect(() => {
    const fetchLogs = async () => {
      const result = await useFetchLog();
      if (result.Status !== "error") {
        const logs = result.logList.filter(log => {
          const logDate = new Date(log.startTime).toISOString().slice(0, 10);
          return logDate === formattedSelectedDate;
        });
        setDailyData(logs);
        setTotal(logs.reduce((sum, item) => sum + parseInt(item.totalAmount), 0));
      }
    };

    fetchLogs();
  }, [formattedSelectedDate]);

  const doughnutData = {
    labels: ["Thể tích bể", "Số lượng hàng tồn"],
    datasets: [
      {
        label: "Tồn kho",
        data: [70, 30],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
        ],
        hoverOffset: 10,
      },
    ],
  };

  const barData = {
    labels: ["MH1", "MH2", "MH3", "MH4", "MH5", "MH6"],
    datasets: [
      {
        label: "DOANH THU SẢN LƯỢNG",
        data: [0, 100, 200, 300, 400],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
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
      <div className="tilte_revenue">
        <h1>Chuyên gia Xăng dầu số hàng đầu Việt Nam</h1>
        <p>Chuyển đổi số hiệu quả, nâng cao năng suất hoạt động.</p>
      </div>
      <div className="Row">
        <div className="barChart">
          <div className="title_xemChitiet">
            DOANH THU SẢN LƯỢNG
          </div>
          <Bar
            data={barData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
          <div className="button_xemChitiet">
            <button>Xem chi tiết</button>
          </div>
        </div>
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
            <button>Xem chi tiết</button>
          </div>
        </div>
      </div>

      <br />
      <br />
      <br />
      <br />
 
      <div className="Row">
        <div className="Column doanh_thu">
          <div className="Row row_image">
            <div className="object_body">
              <div className="object_box"> 4 </div>
              <Link className="object_a" to="/staff">
                <IoMdPeople /> 
                <span>NHÂN VIÊN</span> 
              </Link>
            </div>
            <div className="object_body">
              <div className="object_box"> 5 </div>
              <Link  to="/product" className="object_a">
                <AiOutlineProduct /> 
                <span>MẶT HÀNG</span>
              </Link>
            </div>
            <div className="object_body">
              <div className="object_box"> 6 </div>
              <Link to="/pump" className="object_a">
                <PiGasPumpBold />
                <span>VÒI BƠM</span>
              </Link>
            </div>
            <div className="object_body">
              <div className="object_box"> 7 </div>
              <Link to="/tank"className="object_a">
                <GiFuelTank />
                <span> BỂ </span>
              </Link>
            </div>
          </div>

          <header>
            <h4>DOANH THU VÒI BƠM</h4>
            <div className="search-container">
              <FaMagnifyingGlass className="search-icon" />
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
                  <th>Tên vòi bơm</th>
                  <th>Số đầu - số cuối</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {pumps.map((staffMember) => (
                  <tr
                    key={staffMember.pumpCode}
                    className="col"
                    id="mainstate"
                  >
                    <td>{staffMember.pumpName}</td>
                    <td>
                      {staffMember.pumNumber
                        ? `${staffMember.pumNumber.pumpFrist} - ${staffMember.pumNumber.pumpSecond}`
                        : "Chưa có dữ liệu"}
                    </td>
                    <td className="icon_editview">
                      <TbEyeEdit
                        className="icon_menu"
                        onClick={() =>  handleEdit(staffMember)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              <h4>{formattedDate}</h4>
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
                          <td>{timeConverter(item.startTime).time}</td>
                          <td>{item.totalAmount}</td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="left_sum"> Tổng: </td>
                      <td className="right_sum">{total.toLocaleString("vi-VN")}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
          <div className="button_xemChitiet borders" onClick={() => setLogExists(true)}>
            <button>Xem chi tiết</button>
          </div>
          {logExists && (
          <>  
            <div className="overlay" onClick={() => setLogExists(false)}></div>
            <div className="viewShift">
            <AiOutlineClose
              onClick={() => setLogExists(false)}
              className="close_icon"
            />
            <h4>LƯỢNG TỒN TRONG CA</h4>
            <hr/>
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
                <h4>{formattedDate}</h4>
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
                            <td>{timeConverter(item.startTime).time}</td>
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
                        <th className="right_sum" colSpan={5}>{total.toLocaleString("vi-VN")}</th>
                      </tr>
                    </tfoot>
                  </table>
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
