import { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import "chart.js/auto";
import { FaSignOutAlt, FaBoxes } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import useProductStore from "../../../store/productStore.js";
import usePumpStore from "../../../store/pumpStore.js";

import "./Revenue.css";

const data = {
  "2024-06-14": [
    { time: "40p", tiêuHao: 40000 },
    { time: "40p", tiêuHao: 40000 },
    { time: "40p", tiêuHao: 40000 },
  ],
  "2024-06-13": [
    { time: "40p", tiêuHao: 30000 },
    { time: "40p", tiêuHao: 30000 },
    { time: "40p", tiêuHao: 30000 },
  ],
  "2024-06-15": [
    { time: "40p", tiêuHao: 20000 },
    { time: "40p", tiêuHao: 20000 },
    { time: "40p", tiêuHao: 20000 },
  ],
};

export const Revenue = () => {
  const pumps = usePumpStore((state) => state.pumps);
  const fetchPump = usePumpStore((state) => state.fetchPump);
  const addPump = usePumpStore((state) => state.addPump);
  const modifyPump = usePumpStore((state) => state.modifyPump);
  const product = useProductStore((state) => state.product);
  const fetchProduct = useProductStore((state) => state.fetchProduct);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedSelectedDate = selectedDate.toISOString().slice(0, 10);
  const dailyData = data[formattedSelectedDate];
  const total = dailyData
    ? dailyData.reduce((sum, item) => sum + item.tiêuHao, 0)
    : 0;

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

  const [openEmail, setOpenEmail] = useState(null);
  const [newStaff, setNewStaff] = useState({
    pid: "",
    pumpId: "",
    pumpName: "",
    product: {
      productName: "",
    },
    pumNumber: {
      pumpFrist: "",
      pumpSecond: "",
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

  return (
    <div className="revenue">
      <div className="tilte_revenue">
        <h1>Chuyên gia Xăng dầu số hàng đầu Việt Nam</h1>
        <p>Chuyển đổi số hiệu quả, nâng cao năng suất hoạt động.</p>
      </div>
      <div className="Row">
        <div className="barChart">
          <div className="title_xemChitiet">
            DOANH THU SAN LUONG
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
      <b>
      <br />
      <br />
      <br />
      </b>
      <div className="Row">
        <div className="Column doanh_thu">
          <div className="Row row_image">
            <div className="object_body">
              <div className="Row">
                <div className="object_name">
                  <h6>NHÂN VIÊN</h6>
                  <p>30</p>
                </div>
                <div className="object_image_body">
                  <FaSignOutAlt className="icon_image" />
                </div>
              </div>
              <div className="object_button">
                <button>Xem chi tiết</button>
              </div>
            </div>
            <div className="object_body">
              <div className="Row">
                <div className="object_name">
                  <h6>MẶT HÀNG</h6>
                  <p>6</p>
                </div>
                <div className="object_image_body">
                  <FaBoxes className="icon_image" />
                </div>
              </div>
              <div className="object_button">
                <button>Xem chi tiết</button>
              </div>
            </div>
            <div className="object_body">
              <div className="Row">
                <div className="object_name">
                  <h6>BỂ</h6>
                  <p>4</p>
                </div>
                <div className="object_image_body">
                  <FaBoxes className="icon_image" />
                </div>
              </div>
              <div className="object_button">
                <button>Xem chi tiết</button>
              </div>
            </div>
            <div className="object_body">
              <div className="Row">
                <div className="object_name">
                  <h6>VÒI BƠM</h6>
                  <p>13</p>
                </div>
                <div className="object_image_body">
                  <FaSignOutAlt className="icon_image" />
                </div>
              </div>
              <div className="object_button">
                <button>Xem chi tiết</button>
              </div>
            </div>
          </div>

          <header>
            <h4>DOANH THU VOI BƠM</h4>
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
                  <th>Mặt hàng vòi bơm</th>
                  <th colSpan={2}>Số đầu - số cuối</th>
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
                    <td>{staffMember.product.productName}</td>
                    <td>
                      {staffMember.pumNumber
                        ? `${staffMember.pumNumber.pumpFrist} - ${staffMember.pumNumber.pumSecond}`
                        : "Chưa có dữ liệu"}
                    </td>
                    <td className="icon_editview">
                      <IoEllipsisVerticalOutline
                        className="icon_menu"
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
                      <th>Time</th>
                      <th>Tiêu hao</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyData &&
                      dailyData.map((item, index) => (
                        <tr key={index}>
                          <td>{item.time}</td>
                          <td>
                            {item.tiêuHao.toLocaleString("vi-VN")}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={2}>
                        Tổng: {total.toLocaleString("vi-VN")}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
          <div className="button_xemChitiet borders">
            <button>Xem chi tiết</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;