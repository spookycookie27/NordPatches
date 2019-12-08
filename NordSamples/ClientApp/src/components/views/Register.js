import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import RestUtilities from '../../services/RestUtilities';
import isEmail from 'validator/lib/isEmail';
import LoginLayout from '../common/LoginLayout';
import { loginStyles } from '../common/Common';

export default function SignUp(props) {
  const classes = loginStyles();
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [disabled, setDisabled] = useState(false);
  var isPasswordInvalid = !!(password && (password.length < 5 || password.length > 30));
  var isLoginInvalid = !!((login && login.length < 5) || login.length > 16);

  async function handleRegisterClick() {
    const url = '/api/auth/register';
    const data = { email, password, login };
    setDisabled(true);
    setFeedback('');
    var response = await RestUtilities.post(url, data);
    if (response.ok) {
      setFeedback('Please check your email to confirm.');
    } else {
      response
        .json()
        .then(response => {
          setFeedback(response);
          setDisabled(false);
        })
        .catch(() => {
          setFeedback('Oops. Something went wrong');
          setDisabled(false);
        });
    }
  }

  return (
    <LoginLayout title='Register'>
      <form className={classes.form} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant='outlined'
              required
              fullWidth
              value={email}
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
              onChange={event => {
                setEmail(event.target.value);
              }}
              onBlur={() => {
                setIsEmailInvalid(!isEmail(email));
              }}
              disabled={disabled}
              error={isEmailInvalid}
              helperText={isEmailInvalid && 'Not an email address.'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              minLength={5}
              maxLength={16}
              variant='outlined'
              value={login}
              margin='normal'
              required
              fullWidth
              id='login'
              label='Login'
              name='login'
              autoComplete='username'
              onChange={event => {
                setLogin(event.target.value);
              }}
              disabled={disabled}
              error={isLoginInvalid}
              helperText={isLoginInvalid && 'Must be minimum 5 characters and maximum of 16'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              minLength={5}
              maxLength={30}
              variant='outlined'
              required
              fullWidth
              value={password}
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              onChange={event => {
                setPassword(event.target.value);
              }}
              disabled={disabled}
              error={isPasswordInvalid}
              helperText={isPasswordInvalid && 'Must be minimum 5 characters and maximum of 30'}
            />
          </Grid>
        </Grid>
        <Button fullWidth variant='contained' color='secondary' className={classes.submit} onClick={() => handleRegisterClick()} disabled={disabled}>
          Sign Up
        </Button>
        {feedback && (
          <Grid container>
            <Grid item xs={12}>
              <Typography component='p'>{feedback}</Typography>
            </Grid>
          </Grid>
        )}

        <Box mt={5}>
          <Grid container justify='flex-end'>
            <Grid item xs>
              <Link to={'/forgotPassword'}>Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link to={'/login'}>Already have an account? Sign in</Link>
            </Grid>
          </Grid>
        </Box>
      </form>
    </LoginLayout>
  );
}
