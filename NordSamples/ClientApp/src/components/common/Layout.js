import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LoadingMask from '../common/LoadingMask';
import { siteName } from '../../Constants';

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary'>
      {'Copyright © '}
      {siteName} {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  main: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2)
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
    textAlign: 'center'
  }
}));

function Layout(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Container component='main' className={classes.main} maxWidth='xl'>
        {props.children}
      </Container>

      <footer className={classes.footer}>
        <Container maxWidth='sm'>
          <Copyright />
        </Container>
      </footer>
      {props.loading && <LoadingMask />}
    </div>
  );
}

const mapStateToProps = state => ({
  loading: state.loading
});

export default connect(mapStateToProps)(withRouter(Layout));
