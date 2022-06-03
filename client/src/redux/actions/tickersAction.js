import { SET_TICKERS } from '../constants/actionsTypes';

export const setStocks = items => ({
  type: SET_TICKERS,
  payload: items,
});

export const fetchStocks = socket => dispatch => {
  socket.on('ticker', data => {
    // console.log('tickets from socket', data);
    let result = Array.isArray(data) ? data : [data];
    return dispatch(setStocks(result))
  });
};
