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
  user: null,
  patches: [],
  files: [],
  pageSize: 10
};

const LOCAL_STORAGE_KEY = 'nord-samples';

const parseState = str => {
  return JSON.parse(str);
};

const stateFromStorage = parseState(localStorage.getItem(LOCAL_STORAGE_KEY));
const initialState = { ...defaultState, ...stateFromStorage };

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'setUser':
      return {
        ...state,
        user: action.user
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
      const foundIndex = state.patches.findIndex(x => x.id === action.patch.id);
      state.patches[foundIndex] = action.patch;
      return { ...state };
    }
    default:
      return state;
  }
};

// function updateObjectInArray(array, action) {
//   return array.map((item, index) => {
//     if (index !== action.index) {
//       // This isn't the item we care about - keep it as-is
//       return item;
//     }

//     // Otherwise, this is the one we want - return an updated value
//     return {
//       ...item,
//       ...action.item
//     };
//   });
// }

const saveStateToStorage = ({ getState }) => next => action => {
  const returnValue = next(action);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(getState()));
  return returnValue;
};

export const { GlobalStateProvider, dispatch, useGlobalState } = createStore(reducer, initialState, applyMiddleware(saveStateToStorage));
