import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import RestUtilities from '../../services/RestUtilities';
import isEmail from 'validator/lib/isEmail';
import LoginLayout from '../common/LoginLayout';
import { useStyles } from '../common/Common';

export default function ForgotPassword(props) {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);

  function handleForgotPasswordClick() {
    const url = '/api/auth/ForgotPassword';
    const data = { email: email };
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
    <LoginLayout title='Forgot Password'>
      <form className={classes.form} noValidate>
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
        <Button fullWidth variant='contained' color='primary' className={classes.submit} onClick={() => handleForgotPasswordClick()} disabled={disabled}>
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
        {disabled || (
          <Grid container>
            <Grid item xs>
              <Link to={'/login'}>Already have an account? Sign in</Link>
            </Grid>
          </Grid>
        )}
      </form>
    </LoginLayout>
  );
}
