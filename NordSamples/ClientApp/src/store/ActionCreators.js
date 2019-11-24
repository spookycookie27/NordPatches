import * as ActionTypes from './Actions';

export const actionCreators = {
  setUser: user => ({ type: ActionTypes.SET_USER, user }),
  setLoading: loading => ({ type: ActionTypes.SET_LOADING, loading })
};
