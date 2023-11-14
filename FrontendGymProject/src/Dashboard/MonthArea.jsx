import React from "react";
import ReactApexChart from "react-apexcharts";

const MonthAreaChart = ({ data }) => {
  const options = {
    chart: {
      id: "month-area-chart",
    },
    xaxis: {
      categories: data.map((entry) => entry.month),
    },
    colors: ['#4caf50'],


  };

  const series = [
    {
      name: "Revenus",
      data: data.map((entry) => entry.revenue),
    },
  ];

  return (
    <div className="month-area-chart">
      <ReactApexChart options={options} series={series} type="area" height={300} />
    </div>
  );
};

export default MonthAreaChart;
