import React from 'react';
import { Table } from 'antd';
import tableSubData from '../data/TableSubData'; 

const columns = [
  {
    title: 'Activity',
    dataIndex: 'activity',
    key: 'activity',
    render: (text) => <span style={{ color: 'blue' }}>{text}</span>,
  },
  {
    title: 'Total Males',
    dataIndex: 'men',
    key: 'men',
  },
  {
    title: 'Total Females',
    dataIndex: 'women',
    key: 'women',
  },
  {
    title: 'Total Members',
    dataIndex: 'members',
    key: 'members',
  },
];

const tableStyle = {
  width: '100%', 
  height: '500px', // You can adjust the height as needed
  
};

const TableSub = () => {
  return (
    <Table
      columns={columns}
      dataSource={tableSubData}
      style={tableStyle}
      size="small" 
      pagination={false}
    />
  );
};

export default TableSub;

