import { SET_TICKERS } from '../constants/actionsTypes';

const initialState = {
  items: [],
};

export const stocksReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TICKERS:
      return {
        ...state,
        items: action.payload,
      };

    default:
      return state;
  }
};
