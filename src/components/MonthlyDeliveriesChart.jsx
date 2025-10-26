import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyDeliveriesChart = ({ months, counts }) => {
  const data = {
    labels: months, // ["Jan", "Feb", ...]
    datasets: [
      {
        label: "Deliveries",
        data: counts, // [10, 15, 7, ...]
        borderColor: "#16a34a",
        backgroundColor: "rgba(22,163,74,0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#16a34a",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#e5e7eb" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default MonthlyDeliveriesChart;
