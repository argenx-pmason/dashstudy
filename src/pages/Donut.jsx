import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
// import { hexToRgb } from "../utility-donut";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Donut(props) {
  const data = {
    datasets: [
      {
        data: [3, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        backgroundColor: [
          "#336699",
          "#99CCFF",
          "#999933",
          "#666699",
          "#CC9933",
          "#006666",
          "#3399FF",
          "#993300",
          "#CCCC99",
          "#666666",
          "#FFFFFF",
          "#FFFFFF",
          "#FFFFFF",
        ],
        display: true,
        borderColor: "#D1D6DC",
      },
      {
        data: [2, 4, 8],
        backgroundColor: ["red", "yellow", "green"],
        display: true,
        borderColor: "#D1D6DC",
      },
    ],
  };

  return (
    <div style={{ height: 200 }}>
      <Doughnut
        data={data}
        options={{
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
            title: {
              display: false,
            },
          },
          rotation: -90,
          circumference: 180,
          cutout: "60%",
          maintainAspectRatio: true,
          responsive: true,
        }}
      />
    </div>
  );
}
