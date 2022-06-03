import React from 'react';
import Table from 'react-bootstrap/Table';

import StocksList from '../../components/StocksList';

const fields = [
  'Ticker',
  'Price',
  'Exchange',
  'Change ($)',
  'Change (%)',
  'Dividend (%)',
  'Yield (%)',
  'Last trade time',
  ''
];


const Dashboard = ({ items }) => {
  // console.log(items);
  return (
    <Table
    responsive='md' size='md' variant='dark' bordered
    // className={styles.table}
    >
      <thead>
        <tr>
          {fields.map((title, i) => (
            <th key={i}>{title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <StocksList items={items} />
      </tbody>
    </Table>
  );
};

export default Dashboard;
