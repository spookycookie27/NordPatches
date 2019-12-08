import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import App from './App';
import theme from './theme';

// Create browser history to use in the Redux store
// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = window.initialReduxState;

const init = async () => {
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>,
    document.querySelector('#root')
  );
};

init();
