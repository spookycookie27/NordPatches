import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import RestUtilities from '../../services/RestUtilities';
import isEmail from 'validator/lib/isEmail';
import LoginLayout from '../common/LoginLayout';
import { useStyles, regexEx } from '../common/Common';

export default function SignUp(props) {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  var isPasswordInvalid = password && !regexEx.test(password);

  function handleRegisterClick() {
    const url = '/api/auth/register';
    const data = { email, password, login };
    setDisabled(true);
    RestUtilities.post(url, data).then(async response => {
      if (response.ok) {
        setError(false);
      } else {
        setError(true);
      }
    });
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
                setError(false);
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
                setError(false);
              }}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
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
                setError(false);
              }}
              disabled={disabled}
              error={isPasswordInvalid}
              helperText={isPasswordInvalid && 'Must include 1 number, 1 uppercase leter, 1 lowercase letter and 1  special character'}
            />
          </Grid>
        </Grid>
        <Button fullWidth variant='contained' color='primary' className={classes.submit} onClick={() => handleRegisterClick()} disabled={disabled}>
          Sign Up
        </Button>
        {disabled && !error && (
          <Grid container>
            <Grid item xs={12}>
              <Typography component='p'>Please check your email to confirm your email address.</Typography>
            </Grid>
          </Grid>
        )}
        {disabled && error && (
          <Grid container>
            <Grid item xs={12}>
              <Typography component='p'>Something went wrong.</Typography>
            </Grid>
          </Grid>
        )}
        {disabled || (
          <Grid container justify='flex-end'>
            <Grid item xs>
              <Link to={'/forgotPassword'}>Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link to={'/login'}>Already have an account? Sign in</Link>
            </Grid>
          </Grid>
        )}
      </form>
    </LoginLayout>
  );
}
