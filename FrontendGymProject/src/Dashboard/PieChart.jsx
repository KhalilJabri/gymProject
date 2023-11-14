import React from 'react';
import ReactApexChart from 'react-apexcharts';

const PieChart = ({ data }) => {
  const labels = data.map((item) => item.name);
  const values = data.map((item) => item.value);

  const options = {
    labels: labels,
    dataLabels: {
      enabled: true,
    },
    plotOptions: {
      pie: {
        size: '70%',
        width: 100,   
      },
    },
  };

  const series = values;

  return (
    <div className="pie-chart">
      <ReactApexChart
        options={options}
        series={series}
        type="pie"
        height={400}
      />
    </div>
  );
};

export default PieChart;
