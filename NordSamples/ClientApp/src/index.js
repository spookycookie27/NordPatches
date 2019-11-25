import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './store/configureStore';
import App from './App';
import { CookiesProvider } from 'react-cookie';

// Create browser history to use in the Redux store
// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = window.initialReduxState;
const rootElement = document.getElementById('root');

const init = async () => {
  const { store, persistor } = await configureStore(initialState);
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CookiesProvider>
          <App />
        </CookiesProvider>
      </PersistGate>
    </Provider>,
    rootElement
  );
};

init();
