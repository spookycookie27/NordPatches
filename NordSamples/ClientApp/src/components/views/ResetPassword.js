import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import RestUtilities from '../../services/RestUtilities';
import queryString from 'query-string';
import isEmail from 'validator/lib/isEmail';
import LoginLayout from '../common/LoginLayout';
import InlineError from '../common/InlineError';
import { loginStyles } from '../common/Common';

export default function ResetPassword(props) {
  const classes = loginStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState(null);
  const [code, setCode] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [feedback, setFeedback] = useState('');

  if (!code) {
    const search = props.location.search;
    const parsed = queryString.parse(search);
    setCode(parsed.code);
  }
  const isEmailInvalid = !isEmail(email);
  const isPasswordInvalid = !!(password.length < 5 || password.length > 30);
  const hasErrors = isEmailInvalid || isPasswordInvalid;
  async function handleResetPasswordClick() {
    setDisabled(true);
    const url = '/api/auth/ResetPassword';
    const data = { email, password, code };
    var response = await RestUtilities.post(url, data);
    if (response.ok) {
      setFeedback('Your password was reset. Please sign in using the new password.');
    } else {
      response
        .json()
        .then(res => {
          if (response.status === 400) {
            setErrors(res.errors ? res.errors : res);
            setFeedback('There were errors:');
            setDisabled(false);
          } else if (response.status === 401) {
            setFeedback('Oops. Something went wrong.');
            setDisabled(false);
            setErrors(null);
          }
        })
        .catch(() => {
          setFeedback('Oops. Something went wrong');
          setDisabled(false);
        });
    }
  }

  return (
    <LoginLayout title='Reset Password'>
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
                setFeedback(null);
              }}
              error={!!email && isEmailInvalid}
              helperText={!!email && isEmailInvalid && 'Not an email address.'}
              disabled={disabled}
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
                setFeedback(null);
              }}
              error={!!password && isPasswordInvalid}
              helperText={!!password && isPasswordInvalid && 'Must be minimum 5 characters and maximum of 30'}
              disabled={disabled}
            />
          </Grid>
        </Grid>
        <Button
          fullWidth
          variant='contained'
          color='secondary'
          className={classes.submit}
          onClick={() => handleResetPasswordClick()}
          disabled={disabled || hasErrors}
        >
          Reset Password
        </Button>
        {feedback && (
          <Grid container>
            <Grid item xs={12}>
              <Typography variant='body2'>{feedback}</Typography>
              <InlineError field='email' errors={errors} />
              <InlineError field='password' errors={errors} />
            </Grid>
          </Grid>
        )}
        <Box mt={5}>
          <Grid container justify='flex-end'>
            <Grid item xs>
              <Link to={'/forgotPassword'} className={classes.link}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
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
