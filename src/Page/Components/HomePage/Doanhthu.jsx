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
  import { Link } from "react-router-dom";
  import useFetchRevenue from "../../../store/revenueStore.js";
  import useShiftStore from '../../../store/shiftStore.js';

  const data = [
    {
      date: '2024-06-24',
      items: [
        { product: 'MH1', revenue: 100, quantity: 50 },
        { product: 'MH2', revenue: 150, quantity: 60 },
        { product: 'MH3', revenue: 200, quantity: 70 },
        { product: 'MH1', revenue: 100, quantity: 50 },
        { product: 'MH2', revenue: 150, quantity: 60 }
      ],
    },
    {
      date: '2024-06-25',
      items: [
        { product: 'MH1', revenue: 120, quantity: 55 },
        { product: 'MH2', revenue: 130, quantity: 65 },
        { product: 'MH3', revenue: 220, quantity: 75 },
        { product: 'MH2', revenue: 130, quantity: 65 },
        { product: 'MH3', revenue: 220, quantity: 75 }
      ],
    },
    {
      date: '2024-06-27',
      items: [
        { product: 'MH1', revenue: 110, quantity: 52 },
        { product: 'MH2', revenue: 140, quantity: 62 },
        { product: 'MH3', revenue: 210, quantity: 72 },
        { product: 'MH2', revenue: 140, quantity: 62 },
        { product: 'MH3', revenue: 210, quantity: 72 }
      ],
    },
  ];

  export const Revenue = () => {
    const pumps = usePumpStore((state) => state.pumps);
    const fetchPump = usePumpStore((state) => state.fetchPump);
    const shifts = useShiftStore((state) => state.shifts);
    const fetchShift = useShiftStore((state) => state.fetchShift);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const formattedSelectedDate = selectedDate.toISOString().slice(0, 10);
    const [dailyData, setDailyData] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [logExists, setLogExists] = useState(false);
    const [showBarDetail, setShowBarDetail] = useState(false);
    const [showDoughnutDetail, setShowDoughnutDetail] = useState(false);
    const [revenueData, setRevenueData] = useState([]);

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
      fetchShift();
      fetchPump();
    }, [fetchShift, fetchPump]);

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

    useEffect(() => {
      const fetchData = async () => {
        const result = await useFetchRevenue();
        setRevenueData(result.revenueList);
        const totalIncome = result.revenueList.reduce((sum, item) => sum + parseInt(item.income), 0);
        const totalQuantity = result.revenueList.reduce((sum, item) => sum + parseInt(item.quantity), 0);
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
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
          ],
          hoverOffset: 10,
        },
      ],
    };

    const [showOverlay, setShowOverlay] = useState(true);
    
    // useEffect(() => {
    //   const timer = setTimeout(() => {
    //     setShowOverlay(false);
    //   }, 2000);

    //   return () => clearTimeout(timer);
    // }, []);

    const currentDate = new Date().toISOString().slice(0, 10);
    const currentData = data.find(entry => entry.date === currentDate) || { items: [] };
    const detailedData = data.find(entry => entry.date === formattedSelectedDate) || { items: [] };

    console.log(Object.keys(detailedData).length)
    const barData = {
      labels: currentData.items.map(item => item.product),
      datasets: [
        {
          label: "DOANH THU",
          data: currentData.items.map(item => item.revenue),
          backgroundColor: "rgba(255, 99, 132, 0.2)", 
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
        {
          label: "SẢN LƯỢNG",
          data: currentData.items.map(item => item.quantity), 
          backgroundColor: "rgba(54, 162, 235, 0.2)", 
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };

    const [selectedItem, setSelectedItem] = useState(null);

    const handleRowClick = (item) => {
      console.log(item);
      setSelectedItem(item);
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
          <button onClick={() => setShowBarDetail(true)}>Xem chi tiết</button>
          </div>           
        </div>
        {showBarDetail && (
          <>
          <div className="overlay" onClick={() => setShowBarDetail(false)}></div>
            <div className="viewShift">
              <AiOutlineClose className="close_icon" onClick={() => setShowBarDetail(false)} />
              <h4>Chi tiết Doanh thu Sản lượng</h4>
              <hr></hr>
              <div>
                <div className="date-selector">
                  <input type="date" value={formattedSelectedDate} onChange={handleDateChange} />
                </div>
                <div className="content">
                  <h4>{formattedDate}</h4>
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Mặt hàng</th>
                          <th>Doanh thu</th>
                          <th>Sản lượng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(detailedData.items).length > 0 ? (
                           detailedData.items.map((item, index) => (
                            <tr key={index}>
                              <td>{item.product}</td>
                              <td>{item.revenue}</td>
                              <td>{item.quantity}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="no-data">
                              Không có dữ liệu
                            </td>
                          </tr>
                        )
                      }
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
              <button onClick={() => {
                  setShowDoughnutDetail(true);
                  setSelectedItem(true);
                  if (revenueData.length > 0) {
                    handleRowClick(revenueData[0]);
                  }
                }}>
                Xem chi tiết
              </button>
            </div>
          </div>
          {showDoughnutDetail && (
              <>
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
                            <th>Số lượng hàng tồn</th>
                          </tr>
                        </thead>
                        <tbody>
                          {revenueData.map((item, index) => (
                            <tr key={index} onClick={() => handleRowClick(item)}>
                              <td>{item.nameTank}</td>
                              <td>{item.income}</td>
                              <td>{item.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {selectedItem && (
                        <>
                        <div style={{height: 300 + 'px', width: 300 + 'px'}}>
                        <Doughnut
                            data={{
                              labels: ["Thể tích bể", "Số lượng hàng tồn"],
                              datasets: [
                                {
                                  label: "Tồn kho",
                                  data: [selectedItem.income, selectedItem.quantity],
                                  backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
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
                            <td>{timeConverter(Date.parse(item.startTime)).time}</td>
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
                              <td>{timeConverter(Date.parse(item.startTime)).time}</td>
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
