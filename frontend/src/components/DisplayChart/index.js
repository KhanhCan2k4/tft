import { Bar, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { Chart as ChartJS, CategoryScale } from "chart.js";

ChartJS.register(CategoryScale);

export default function DisplayChart({ list, lable1, lable2, col1, col2 }) {
  const data = {
    labels: list.map((item) => item[col1]),
    datasets: [
      {
        label: lable1,
        data: list.map((item) => item[col1]),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: lable2,
        data: list.map((item) => item[col2]),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const options = {
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export function PieChart({ list, columnLables }) {
  const documentStyle = getComputedStyle(document.documentElement);
  const data = {
    labels: columnLables,
    datasets: [
      {
        data: list,
        backgroundColor: [
          documentStyle.getPropertyValue("--red-500"),
          documentStyle.getPropertyValue("--orange-500"),
          documentStyle.getPropertyValue("--yellow-500"),
          documentStyle.getPropertyValue("--green-500"),
          documentStyle.getPropertyValue("--blue-500"),
          documentStyle.getPropertyValue("--purple-500"),
          documentStyle.getPropertyValue("--black-500"),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue("--red-500"),
          documentStyle.getPropertyValue("--orange-500"),
          documentStyle.getPropertyValue("--yellow-500"),
          documentStyle.getPropertyValue("--green-500"),
          documentStyle.getPropertyValue("--blue-500"),
          documentStyle.getPropertyValue("--purple-500"),
          documentStyle.getPropertyValue("--black-500"),
        ],
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
        },
      },
    },
  };

  return <Chart type="pie" data={data} options={options} className="w-full md:w-30rem" />
}
