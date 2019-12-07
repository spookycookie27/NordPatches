import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../store/ActionCreators';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { setToken } from '../../services/Auth';
import RestUtilities from '../../services/RestUtilities';
import LoginLayout from '../common/LoginLayout';
import { useStyles } from '../common/Common';

function SignInSide(props) {
  const classes = useStyles();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [useNufCred, setUseNufCred] = useState(true);

  function handleLoginClick() {
    setDisabled(true);
    const url = '/api/auth/login';
    const data = { password, login, useNufCred };
    RestUtilities.post(url, data).then(async response => {
      if (response.ok) {
        setToken(response.content.token, response.content.tokenExpiry);
        props.setUser(response.content.user);
        props.history.push('/');
      } else {
        setError(true);
        setDisabled(false);
      }
    });
  }

  return (
    <LoginLayout title='Login'>
      <form className={classes.form} noValidate>
        <FormControlLabel control={<Switch checked={useNufCred} onChange={() => setUseNufCred(!useNufCred)} />} label='Use my Nord User Forum credentials' />
        <TextField
          variant='outlined'
          value={login}
          margin='normal'
          required
          fullWidth
          id='login'
          label={useNufCred ? 'NUF Username' : 'Login'}
          name='login'
          autoComplete='username'
          autoFocus
          onChange={event => {
            setLogin(event.target.value);
            setError(false);
          }}
          disabled={disabled}
        />
        <TextField
          variant='outlined'
          value={password}
          margin='normal'
          required
          fullWidth
          name='password'
          label={useNufCred ? 'NUF Password' : 'Password'}
          type='password'
          id='password'
          autoComplete='current-password'
          onChange={event => {
            setPassword(event.target.value);
            setError(false);
          }}
          error={error}
          helperText={error && 'This email and password combination is not recognised'}
          disabled={disabled}
        />
        <Button fullWidth variant='contained' color='primary' className={classes.submit} onClick={() => handleLoginClick()} disabled={disabled}>
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <Link to={'/forgotPassword'}>Forgot password?</Link>
          </Grid>
          <Grid item>
            <Link to={'/register'}>{"Don't have an account? Sign Up"}</Link>
          </Grid>
        </Grid>
      </form>
    </LoginLayout>
  );
}

const mapStateToProps = function(state) {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, dispatch => bindActionCreators(actionCreators, dispatch))(SignInSide);
