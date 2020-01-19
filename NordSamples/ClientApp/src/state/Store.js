import React, { useReducer, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'nord-samples';

export const Store = React.createContext();

const parseState = str => {
  return JSON.parse(str);
};

const defaultState = {
  user: null,
  patches: [],
  myPatches: [],
  files: [],
  pageSize: 10,
  mySounds: false,
  columnFilters: false,
  activeMp3Context: null
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
    case 'setMyPatches':
      return {
        ...state,
        myPatches: action.patches
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
      state.patches = updateObjectInArray(state.patches, action.patch);
      state.myPatches = updateObjectInArray(state.myPatches, action.patch);
      return { ...state };
    }
    case 'insertPatch': {
      state.patches.push(action.patch);
      state.myPatches.push(action.patch);
      return { ...state };
    }
    case 'setPlayMp3Id':
      return {
        ...state,
        activeMp3Context: action.activeMp3Context
      };
    default:
      return state;
  }
};

function updateObjectInArray(array, updatedItem) {
  return array.map(item => {
    if (item.id !== updatedItem.id) {
      return item;
    }
    return {
      ...item,
      ...updatedItem
    };
  });
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
