/* eslint-disable indent */
import * as ActionTypes from './Actions';

const initialState = {
  user: null,
  loading: false
};

export const reducer = (state, action) => {
  state = state || initialState;

  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.loading };
    case ActionTypes.SET_USER:
      return { ...state, user: action.user };

    default:
      return { ...state };
  }
};
