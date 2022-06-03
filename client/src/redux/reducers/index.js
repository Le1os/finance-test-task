import { combineReducers } from 'redux';

import { stocksReducer } from './tickersReducer';
import { favoritesReducer } from './favoritesReducer';

export const rootReducer = combineReducers({
  tickers: stocksReducer,
  favorites: favoritesReducer,
});
