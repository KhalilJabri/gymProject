import React from 'react';
import { Card, Space, Statistic } from 'antd';
import { UserOutlined, DollarOutlined, TeamOutlined } from '@ant-design/icons';
import '../Style/Cards.css'; 

const Cards = ({ data }) => {
  return (
    <Space size={24}>
      <Card className="card-sub"> 
        <div className="cardsubStyle">
          <Statistic
            title={<div className="title">Total Subscribers</div>}
            value={data.totalSubscribers}
            prefix={<UserOutlined className="user-icon" />} 
            className="statistic"
          />
          <Statistic
            title={<div className="title">Total Males</div>}
            value={data.totalMales}
            prefix={<TeamOutlined className="male-icon" />} 
            className="statistic"
          />
          <Statistic
            title={<div className="title">Total Females</div>}
            value={data.totalFemales}
            prefix={<TeamOutlined className="female-icon" />}
            className="statisticstyle"
          />
        </div>
      </Card>
      <Card className="cardstyle"> 
        <Statistic
          title={<div className="title">Last Month's Revenue</div>}
          value={`${data.lastMonthRevenue}$`}
          prefix={<DollarOutlined className="revenue-icon" />} 
          className="statisticstyle"
        />
      </Card>
    </Space>
  );
};

export default Cards;
