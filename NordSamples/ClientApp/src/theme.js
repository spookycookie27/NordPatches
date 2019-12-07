import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#26725d'
    },
    secondary: {
      main: '#cc0930'
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
