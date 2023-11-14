import React, { useState } from 'react';
import { Layout, Card, Select } from 'antd';
import Cards from '../Dashboard/Cards';
import cardData from '../data/CardData';
import AreaChart from '../Dashboard/AreaChart';
import areaChartData from '../data/AreaChartData';
import columnChartData from '../data/ColumnChartData.js';
import ColumnChart from '../Dashboard/ColumnChart';
import TableSub from '../Dashboard/TableSub';
import tableSubData from '../data/TableSubData';
import monthAreaChartData  from '../data/MonthAreaData.js';
import MonthAreaChart from '../Dashboard/MonthArea';
import '../Style/Home.css';

const { Content } = Layout;
const { Option } = Select;

const Dashboard = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const handleYearChange = (value) => {
    setSelectedYear(value);
  };
  const yearOptions = [];

  for (let year = currentYear; year >= 2000; year--) {
    yearOptions.push(
      <Option key={year} value={year.toString()}>
        {year}
      </Option>
    );
  }

  return (
    <Content style={{ padding: '24px' }}>
      <h1 className="titleStyle">Dashboard</h1>
      <Cards data={cardData} />
      <div className="cardContainerStyle">
        <Card title="Annual Revenue" className="AreaChartCardStyle">
          <AreaChart data={areaChartData} />
        </Card>
        <Card title="Annual Revenue by Activity" className="columnChartCardStyle">
          <Select
            defaultValue={selectedYear}
            style={{ width: 120 }}
            onChange={handleYearChange}
          >
            {yearOptions}
          </Select>
          <ColumnChart data={columnChartData} selectedYear={selectedYear} />
        </Card>
      </div>
      

      <div className="chartsContainerStyle">
      <Card title="Monthly Revenue" className="MonthAreaStyle">
<Select
            defaultValue={selectedYear}
            style={{ width: 120 }}
            onChange={handleYearChange}
          >
            {yearOptions}
          </Select>
  <MonthAreaChart data={monthAreaChartData} />
</Card>
        <Card title="Activities" className="tableCardStyle">
          <TableSub data={tableSubData} />
        </Card>
        
      </div>


    </Content> 
  );
};

export default Dashboard;
