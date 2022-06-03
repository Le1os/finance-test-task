import React from 'react';

import StockItem from '../StockItem';

const StocksList = ({ items }) => {
  // console.log(items);
  return (
    <>
      {items.map(el => <StockItem key={el.ticker} ticker={el} />)}
    </>
  );
};

export default StocksList;
