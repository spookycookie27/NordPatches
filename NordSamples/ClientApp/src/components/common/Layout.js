import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Zoom from '@material-ui/core/Zoom';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Fab from '@material-ui/core/Fab';
import AppMenu from '../common/Menu';
import { siteName } from '../../Constants';
import { Store } from '../../state/Store';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: theme.palette.primary.main
  },
  main: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor: theme.palette.primary.main,
    textAlign: 'center',
    color: 'white'
  },
  scrollButton: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}));

function Copyright() {
  return (
    <Typography variant='body2'>
      {'Copyright © '}
      {siteName} {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function ScrollTop(props) {
  const { children } = props;
  const classes = useStyles();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100
  });

  const handleClick = event => {
    const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role='presentation' className={classes.scrollButton}>
        {children}
      </div>
    </Zoom>
  );
}

const Layout = props => {
  const classes = useStyles();
  const { state, dispatch } = React.useContext(Store);
  const isNuf = state.queryString.includes('nuf=1');
  useEffect(() => {
    if (props.location.search) {
      dispatch({
        type: 'setQueryString',
        queryString: props.location.search
      });
    }
  }, [props.location.search, dispatch]);

  return (
    <div className={classes.root}>
      <div id='back-to-top-anchor' />

      {isNuf || <AppMenu />}

      <Container component='main' className={classes.main} style={{ marginTop: isNuf ? 0 : '80px' }} maxWidth='xl'>
        {props.children}
      </Container>

      {isNuf || (
        <footer className={classes.footer}>
          <Container maxWidth='sm'>
            <Copyright />
          </Container>
        </footer>
      )}

      <ScrollTop {...props}>
        <Fab color='secondary' size='small' aria-label='scroll back to top'>
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </div>
  );
};

export default withRouter(Layout);
