import React from 'react';
import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Zoom from '@material-ui/core/Zoom';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Fab from '@material-ui/core/Fab';
import Slide from '@material-ui/core/Slide';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import PersonIcon from '@material-ui/icons/Person';
import { useGlobalState } from '../../State';
import { siteName } from '../../Constants';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  main: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    paddingTop: theme.spacing(0)
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor: theme.palette.primary.main,
    textAlign: 'center',
    color: 'white'
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  toolbar: {
    flexWrap: 'wrap'
  },
  toolbarTitle: {
    flexGrow: 1
  },
  link: {
    margin: theme.spacing(1, 1.5),
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

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction='down' in={!trigger}>
      {children}
    </Slide>
  );
}

function ScrollTop(props) {
  const { children, window } = props;
  const classes = useStyles();
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
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

const Link1 = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

function Layout(props) {
  const [user] = useGlobalState('user');
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <HideOnScroll {...props}>
        <AppBar elevation={0} className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Typography variant='h6' color='inherit' noWrap className={classes.toolbarTitle}>
              {siteName}
            </Typography>
            <nav>
              <Link variant='button' component={Link1} to='/' className={classes.link}>
                Home
              </Link>
              <Link variant='button' component={Link1} to='/patches' className={classes.link}>
                Browse Patches
              </Link>
              <Link variant='button' component={Link1} to='/files' className={classes.link}>
                Browse Files
              </Link>
            </nav>
            {user && (
              <>
                <PersonIcon />
                <Typography variant='body2' color='inherit'>
                  {user.username}
                </Typography>
              </>
            )}
            {!user && (
              <Button variant='outlined' className={classes.link} component={Link1} to='/login'>
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar id='back-to-top-anchor' />
      <Container component='main' className={classes.main} maxWidth='xl'>
        {props.children}
      </Container>

      <footer className={classes.footer}>
        <Container maxWidth='sm'>
          <Copyright />
        </Container>
      </footer>

      <ScrollTop {...props}>
        <Fab color='secondary' size='small' aria-label='scroll back to top'>
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </div>
  );
}

export default withRouter(Layout);
