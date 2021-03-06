import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import { signOut, isSignedIn } from '../../services/Auth';
import { Store } from '../../state/Store';

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  link: {
    margin: theme.spacing(1, 1.5),
    color: 'white',
    '&:hover': {
      textDecoration: 'none'
    },
    padding: theme.spacing(1)
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  logoutLink: {
    color: 'white'
  }
}));

function AppMenu(props) {
  const { state, dispatch } = React.useContext(Store);
  const user = state.user;
  const classes = useStyles();
  const Link1 = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const onResetClick = () => {
    dispatch({ type: 'resetState' });
    window.localStorage.clear();
    onSignoutClick();
  };

  const onSignoutClick = () => {
    handleClose();
    signOut();
    dispatch({
      type: 'setUser',
      user: null
    });
    props.history.push('/login');
  };

  const onLoginClick = () => {
    props.history.push('/login');
  };

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = route => {
    handleClose();
    props.history.push(route);
  };

  return (
    <AppBar>
      <Toolbar className={classes.toolbar}>
        <Box component='div' display={{ xs: 'none', sm: 'flex' }} my={1}>
          <Link variant='button' component={Link1} to='/'>
            <img src='/Images/logo10.png' alt='nord user samples and patches' height='60' />
          </Link>
        </Box>
        <div className={classes.grow} />

        <nav className={classes.sectionDesktop}>
          <Link variant='button' component={Link1} to='/sounds' className={classes.link}>
            ALl Sounds
          </Link>
          <Link variant='button' component={Link1} to='/addsound' className={classes.link}>
            Add New
          </Link>
          {user && user.role === 'administrator' && (
            <Link variant='button' component={Link1} to='/files' className={classes.link}>
              Files
            </Link>
          )}
          {isSignedIn() ? (
            <Button onClick={onSignoutClick} className={classes.link}>
              Logout
            </Button>
          ) : (
            <Button onClick={onLoginClick} className={classes.link}>
              Login
            </Button>
          )}
        </nav>

        <div className={classes.sectionMobile}>
          <IconButton aria-label='show more' aria-controls='menu-appbar' aria-haspopup='true' onClick={handleMenu} color='inherit'>
            <MenuIcon />
          </IconButton>
        </div>
        <Menu
          id='menu-appbar'
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleNavigate('/sounds')}>All Sounds</MenuItem>
          <MenuItem onClick={() => handleNavigate('/addsound')}>Add New</MenuItem>
          {user && user.role === 'administrator' && <MenuItem onClick={() => handleNavigate('/files')}>Files</MenuItem>}
          {isSignedIn() ? <MenuItem onClick={onSignoutClick}>Logout</MenuItem> : <MenuItem onClick={onLoginClick}>Login</MenuItem>}
          {isSignedIn() && <MenuItem onClick={onResetClick}>Reset App</MenuItem>}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default withRouter(AppMenu);
