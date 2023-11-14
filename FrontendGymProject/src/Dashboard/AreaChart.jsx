import React from 'react';
import ReactApexChart from 'react-apexcharts';

const AreaChart = ({ data }) => {
  const labels = data.map((item) => item.year);
  const values = data.map((item) => item.revenue);

  const options = {
    chart: {
      type: 'area',
      height: 350,
    },
    xaxis: {
      categories: labels,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
  };

  const series = [
    {
      name: 'Revenue',
      data: values,
    },
  ];

  return (
    <div className="area-chart">
      <ReactApexChart options={options} series={series} type="area" height={300} />
    </div>
  );
};

export default AreaChart;
