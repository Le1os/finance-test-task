import React from 'react';
import { useSelector } from 'react-redux';

import Dashboard from '../components/Dashboard';

export const Favorites = () => {
  const favorites = useSelector(({ favorites }) => favorites.items);

  return (
    <div id="favorites-page">
      <Dashboard items={favorites} />
    </div>
  );
};
