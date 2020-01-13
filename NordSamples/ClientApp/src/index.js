import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { StoreProvider } from './state/Store';
import App from './App';
import theme from './theme';

const init = async () => {
  ReactDOM.render(
    <StoreProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StoreProvider>,
    document.querySelector('#root')
  );
};

init();
