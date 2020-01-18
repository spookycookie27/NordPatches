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
import InlineError from '../common/InlineError';
import { loginStyles } from '../common/Common';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Store } from '../../state/Store';

function SignInSide(props) {
  const { dispatch } = React.useContext(Store);
  const classes = loginStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [errors, setErrors] = useState(null);

  const isPasswordInvalid = !!(password.length < 5 || password.length > 30);
  const isUsernameInvalid = !!(username.length < 5 || username.length > 16);
  const hasErrors = isUsernameInvalid || isPasswordInvalid;
  async function handleLoginClick() {
    setDisabled(true);
    const url = '/api/auth/login';
    const data = { password, username };
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
          props.history.push('/sounds');
        } else if (response.status === 400) {
          setErrors(res.errors ? res.errors : res);
          setFeedback('There were errors:');
          setDisabled(false);
        } else if (response.status === 401) {
          setFeedback('The username and password combination was not recognised.');
          setDisabled(false);
          setErrors(null);
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              minLength={5}
              maxLength={16}
              variant='outlined'
              value={username}
              margin='normal'
              required
              fullWidth
              id='username'
              label={'Username'}
              name='username'
              autoComplete='username'
              autoFocus
              onChange={event => {
                setUsername(event.target.value);
                setFeedback(null);
              }}
              disabled={disabled}
              error={isUsernameInvalid && !!username}
              helperText={isUsernameInvalid && !!username && 'Must be minimum 5 characters and maximum of 16'}
            />
          </Grid>

          <Grid item xs={12}>
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
                setFeedback(null);
              }}
              error={!!password && isPasswordInvalid}
              helperText={!!password && isPasswordInvalid && 'Must be minimum 5 characters and maximum of 30'}
              disabled={disabled}
            />
          </Grid>
        </Grid>
        <Button fullWidth variant='contained' color='secondary' className={classes.submit} onClick={() => handleLoginClick()} disabled={disabled || hasErrors}>
          Sign In
        </Button>
        {disabled && (
          <Box m={2}>
            <LinearProgress color='secondary' />
          </Box>
        )}
        {feedback && (
          <Grid container>
            <Grid item xs={12}>
              <Typography component='p'>{feedback}</Typography>
              <InlineError field='username' errors={errors} />
              <InlineError field='password' errors={errors} />
            </Grid>
          </Grid>
        )}
        <Box mt={5}>
          <Grid container>
            <Grid item xs>
              <Link to={'/forgotPassword'} className={classes.link}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to={'/register'} className={classes.link}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </form>
    </LoginLayout>
  );
}

export default SignInSide;
