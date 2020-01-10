import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  link: {
    color: '#990000'
  },
  palette: {
    primary: {
      main: '#990000',
      lighter: '#944b4b'
    },
    secondary: {
      main: '#26725d'
    },
    error: {
      main: red.A400
    },
    background: {
      default: '#fff'
    }
  }
});

export default theme;
