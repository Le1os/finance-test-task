import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { fetchStocks } from '../../redux/actions/tickersAction';
import { fetchFavorites } from '../../redux/actions/favoritesAction';

import { routes } from '../../routes/routes';
import { socket } from '../../utils/socket-api';

import Header from '../../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    socket.emit('start');

    return socket.disconnect;
  }, []);
  
  React.useEffect(() => {
    dispatch(fetchStocks(socket));
    dispatch(fetchFavorites(socket));
  }, [dispatch]);


  return (
    <div className="content">
      <Header />
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </div>
  );
};

export default App;
