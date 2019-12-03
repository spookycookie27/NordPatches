import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './store/configureStore';
import App from './App';
import { CookiesProvider } from 'react-cookie';
import LoadingMask from './components/common/LoadingMask';
import theme from './theme';

// Create browser history to use in the Redux store
// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = window.initialReduxState;

const init = async () => {
  const { store, persistor } = await configureStore(initialState);
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={<LoadingMask />} persistor={persistor}>
        <CookiesProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </CookiesProvider>
      </PersistGate>
    </Provider>,
    document.querySelector('#root')
  );
};

init();
