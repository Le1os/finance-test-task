import { SET_FAVORITES } from '../constants/actionsTypes';


export const setFavorites = items => ({
  type: SET_FAVORITES,
  payload: items,
});

export const fetchFavorites = socket => dispatch => {
socket.on('favorite', data => {
  let result = Array.isArray(data) ? data : [data];
    dispatch(setFavorites(result));
  })
};