import React from 'react';
import { useSelector } from 'react-redux';

import Dashboard from '../components/Dashboard';

export const Home = () => {
  const tickers = useSelector(({ tickers }) => tickers.items);
  // console.log('#', tickers);
  return (
    <div id="home-page">
      <Dashboard items={tickers} />
    </div>
  );
};
