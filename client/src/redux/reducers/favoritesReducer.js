import { SET_FAVORITES } from '../constants/actionsTypes';

const initialState = {
  items: [],
};

export const favoritesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FAVORITES:
      return {
        ...state,
        items: action.payload,
      };

    default:
      return state;
  }
};
