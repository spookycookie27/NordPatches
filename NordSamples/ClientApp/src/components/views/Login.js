import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { setToken } from '../../services/Auth';
import RestUtilities from '../../services/RestUtilities';
import LoginLayout from '../common/LoginLayout';
import { loginStyles } from '../common/Common';
import { dispatch } from '../../State';

function SignInSide(props) {
  const classes = loginStyles();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [feedback, setFeedback] = useState('');

  var isPasswordInvalid = !!(password && (password.length < 5 || password.length > 30));
  var isLoginInvalid = !!((login && login.length < 5) || login.length > 16);

  async function handleLoginClick() {
    setDisabled(true);
    const url = '/api/auth/login';
    const data = { password, login };
    var response = await RestUtilities.post(url, data);
    response
      .json()
      .then(res => {
        if (response.ok) {
          setToken(res.token, res.tokenExpiry);
          dispatch({
            type: 'setUser',
            user: res.user
          });
          props.history.push('/');
        } else {
          setFeedback(res);
          setDisabled(false);
        }
      })
      .catch(() => {
        setFeedback('Something went wrong.');
        setDisabled(false);
      });
  }

  return (
    <LoginLayout title='Login'>
      <form className={classes.form} noValidate>
        <TextField
          minLength={5}
          maxLength={16}
          variant='outlined'
          value={login}
          margin='normal'
          required
          fullWidth
          id='login'
          label={'Login'}
          name='login'
          autoComplete='username'
          autoFocus
          onChange={event => {
            setLogin(event.target.value);
          }}
          disabled={disabled}
          error={isLoginInvalid}
          helperText={isLoginInvalid && 'Must be minimum 5 characters and maximum of 16'}
        />
        <TextField
          minLength={5}
          maxLength={30}
          variant='outlined'
          value={password}
          margin='normal'
          required
          fullWidth
          name='password'
          label={'Password'}
          type='password'
          id='password'
          autoComplete='current-password'
          onChange={event => {
            setPassword(event.target.value);
          }}
          error={isPasswordInvalid}
          helperText={isPasswordInvalid && 'Must be minimum 5 characters and maximum of 30'}
          disabled={disabled}
        />
        <Button fullWidth variant='contained' color='secondary' className={classes.submit} onClick={() => handleLoginClick()} disabled={disabled}>
          Sign In
        </Button>
        {feedback && (
          <Grid container>
            <Grid item xs={12}>
              <Typography component='p'>{feedback}</Typography>
            </Grid>
          </Grid>
        )}
        <Box mt={5}>
          <Grid container>
            <Grid item xs>
              <Link to={'/forgotPassword'}>Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link to={'/register'}>{"Don't have an account? Sign Up"}</Link>
            </Grid>
          </Grid>
        </Box>
      </form>
    </LoginLayout>
  );
}

export default SignInSide;
