import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import localForage from 'localforage';
import { reducer } from './Reducers';
import { logger } from 'redux-logger';

export default function configureStore(initialState) {
  const middleware = [thunk];

  // In development, use the browser's Redux dev tools extension if installed
  const enhancers = [];
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment && typeof window !== 'undefined' && window.devToolsExtension) {
    enhancers.push(window.devToolsExtension());
  }
  if (isDevelopment) {
    middleware.push(logger);
  }

  const persistConfig = {
    key: 'root',
    storage: localForage,
    blacklist: ['loading']
  };

  const persistedReducer = persistReducer(persistConfig, reducer);

  const store = createStore(persistedReducer, initialState, compose(applyMiddleware(...middleware), ...enhancers));
  let persistor = persistStore(store);

  return { store, persistor };
}
