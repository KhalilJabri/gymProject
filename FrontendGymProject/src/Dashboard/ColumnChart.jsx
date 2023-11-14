import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ColumnChart = ({ data }) => {
  const categories = data.map((item) => item.activité);
  const revenue = data.map((item) => item.revenue);

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        distributed: true, 
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#333'],
      },
    },
    xaxis: {
      categories: categories,
    },
    colors: ['#007acc', '#61ce70', '#f39c12', '#e74c3c', '#9b59b6'],
  };

  const series = [
    {
      name: 'Revenue',
      data: revenue,
    },
  ];

  return (
    <div className="column-chart">
      <ReactApexChart options={options} series={series} type="bar" height={300} />
    </div>
  );
};

export default ColumnChart;