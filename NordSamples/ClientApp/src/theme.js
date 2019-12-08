import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  link: {
    color: '#cc0930'
  },
  palette: {
    primary: {
      main: '#cc0930'
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
