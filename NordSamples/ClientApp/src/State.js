import { createStore } from 'react-hooks-global-state';

const applyMiddleware = (...args) => creator => {
  const [first, ...rest] = args;
  if (!first) return creator;
  creator = applyMiddleware(...rest)(creator);
  return (reducer, initialState) => {
    const store = creator(reducer, initialState);
    const dispatch = first(store)(store.dispatch);
    return { ...store, dispatch };
  };
};

const defaultState = {
  user: null
};

const LOCAL_STORAGE_KEY = 'nord-samples';

const parseState = str => {
  return JSON.parse(str);
};

const stateFromStorage = parseState(localStorage.getItem(LOCAL_STORAGE_KEY));
const initialState = stateFromStorage || defaultState;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'setUser':
      return {
        ...state,
        user: action.user
      };
    default:
      return state;
  }
};

const saveStateToStorage = ({ getState }) => next => action => {
  const returnValue = next(action);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(getState()));
  return returnValue;
};

export const { GlobalStateProvider, dispatch, useGlobalState } = createStore(reducer, initialState, applyMiddleware(saveStateToStorage));
