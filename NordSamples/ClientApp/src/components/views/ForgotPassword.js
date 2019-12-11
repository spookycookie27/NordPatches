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

export default function ForgotPassword(props) {
  const classes = loginStyles();
  const [email, setEmail] = useState('');
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);

  async function handleForgotPasswordClick() {
    const url = '/api/auth/ForgotPassword';
    const data = { email: email };
    setDisabled(true);
    await RestUtilities.post(url, data)
      .then(() => setError(false))
      .catch(() => setError(true));
  }

  return (
    <LoginLayout title='Forgot Password'>
      <form className={classes.form} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant='outlined'
              value={email}
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
              onChange={event => {
                setIsEmailInvalid(!isEmail(event.target.value));
                setEmail(event.target.value);
              }}
              error={isEmailInvalid}
              helperText={isEmailInvalid && 'Not an email address.'}
              disabled={disabled}
            />
          </Grid>
          <Button
            fullWidth
            variant='contained'
            color='secondary'
            className={classes.submit}
            onClick={() => handleForgotPasswordClick()}
            disabled={disabled || isEmailInvalid}
          >
            Reset Password
          </Button>
          {disabled && !error && (
            <Grid container>
              <Grid item xs={12}>
                <Typography component='p'>Please check your email to continue resetting your password.</Typography>
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
        </Grid>
        <Box mt={5}>
          <Grid container>
            <Grid item xs>
              <Link to={'/login'} className={classes.link}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </form>
    </LoginLayout>
  );
}
