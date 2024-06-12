import React from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./Revenue.css";

export const Revenue = () => {
  const doughnutData = {
    labels: ["Đang làm việc", "Đã nghỉ việc"],
    datasets: [
      {
        label: "NHÂN VIÊN",
        data: [30, 30],
        backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
        hoverOffset: 10,
      },
    ],
  };

  const barData = {
    labels: [2010, 2011, 2012, 2013, 2014, 2015, 2016],
    datasets: [
      {
        label: 'Acquisitions by year',
        data: [0, 100, 200, 300, 400],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <div> 
        <h1>Chuyên gia Xăng dầu số hàng đầu Việt Nam</h1>
        <p>Chuyển đổi số hiệu quả, nâng cao năng suất hoạt động.</p>
      </div>
      <div className="Row">
        <div>
          <Bar
            data={barData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Acquisitions by year',
                },
              },
            }}
          />
        </div>
        <div>
          <Doughnut
            data={doughnutData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Employee Status',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Revenue;
