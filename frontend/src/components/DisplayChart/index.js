import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale);
ChartJS.register(LinearScale);
ChartJS.register(PointElement);
ChartJS.register(LineElement);
ChartJS.register(ArcElement);
ChartJS.register(BarElement);

export default function DisplayChart({
  list,
  lable1,
  lable2,
  col1,
  col2,
  colLabel,
}) {
  const data = {
    labels: list.map(
      (item) =>
        item[colLabel] &&
        (item[colLabel].length > 20
          ? item[colLabel].substring(0, 20) + "..."
          : item[colLabel])
    ),
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

  return (
    <>
      <Bar data={data} options={options} plugins={[ChartDataLabels]} />
      <div className="row">
        <div
          className="my-1 col-1 offset-4"
          style={{ backgroundColor: "rgba(255, 99, 132, 0.5)" }}
        ></div>
        <div className="my-1 col-2">{lable1}</div>

        <div
          className="my-1 col-1"
          style={{ backgroundColor: "rgba(54, 162, 235, 0.5)" }}
        ></div>
        <div className="my-1 col-2">{lable2}</div>
      </div>
    </>
  );
}

export function PieChart({ list = [], columnLabels = [] }) {
  const bgs = [
    "#de425b",
    "#e86774",
    "#f1878e",
    "#f8a6a9",
    "#fcc4c5",
    "#ffe1e2",
    "#006666",
    "#3399FF",
    "#993300",
    "#CCCC99",
    "#666666",
  ];
  const data = {
    maintainAspectRatio: true,
    responsive: true,
    labels: columnLabels,
    datasets: [
      {
        data: list,
        backgroundColor: bgs,
        hoverBackgroundColor: bgs,
      },
    ],
  };
  const pieOptions = {
    legend: {
      display: true,
      position: "right",
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
  };

  return (
    <div className="row">
      <div className="col-lg-6">
        <Pie data={data} options={pieOptions} />
      </div>

      <div className="col-lg-6">
        {columnLabels.map((col, index) => (
          <div className="row" key={index}>
            <div
              className="my-1 col-1 offset-2"
              style={{ backgroundColor: bgs[index] }}
            ></div>
            <div className="my-1 col-7">{col}</div>
            <div className="my-1 col-2">
              <b>{list[index]}</b>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LineChart({
  columnLabels = [],
  firstName = "First dataset",
  lastName = "Last dataset",
  firstData = [],
  lastData = [],
}) {
  console.log(firstData, lastData);
  const data = {
    labels: columnLabels,
    datasets: [
      {
        label: firstName,
        data: firstData,
        fill: true,
        borderColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: lastName,
        data: lastData,
        fill: false,
        borderColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const options = {
    legend: {
      display: true,
      position: "right",
    },
  };

  return (
    <>
      <Line key={new Date()} data={data} options={options} />

      <div className="row">
        <div
          className="my-1 col-1 offset-2"
          style={{ backgroundColor: "rgba(255, 99, 132, 0.5)" }}
        ></div>
        <div className="my-1 col-2">{firstName}</div>

        <div
          className="my-1 col-1"
          style={{ backgroundColor: "rgba(54, 162, 235, 0.5)" }}
        ></div>
        <div className="my-1 col-2">{lastName}</div>

        <div
          className="my-1 col-1"
          style={{ backgroundColor: "#cc99bc" }}
        ></div>
        <div className="my-1 col-2">{"ALL"}</div>
      </div>
    </>
  );
}
