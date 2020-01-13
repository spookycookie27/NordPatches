import React, { useReducer, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'nord-samples';

export const Store = React.createContext();

const parseState = str => {
  return JSON.parse(str);
};

const defaultState = {
  user: null,
  patches: [],
  files: [],
  pageSize: 10,
  mySounds: false,
  columnFilters: false
};

const localState = parseState(localStorage.getItem(LOCAL_STORAGE_KEY));
const initialState = { ...defaultState, ...localState };

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'setUser':
      return {
        ...state,
        user: action.user
      };
    case 'setMySounds':
      return {
        ...state,
        mySounds: action.mySounds
      };
    case 'setColumnFilters':
      return {
        ...state,
        columnFilters: action.columnFilters
      };
    case 'setPatches':
      return {
        ...state,
        patches: action.patches
      };
    case 'setFiles':
      return {
        ...state,
        files: action.files
      };
    case 'setPageSize':
      return {
        ...state,
        pageSize: action.pageSize
      };
    case 'updatePatch': {
      let foundIndex = state.patches.findIndex(x => x.id === action.patch.id);
      state.patches[foundIndex] = action.patch;
      return { ...state };
    }
    case 'insertPatch': {
      state.patches.push(action.patch);
      return { ...state };
    }
    default:
      return state;
  }
};

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
