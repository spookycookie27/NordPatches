import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import RestUtilities from '../../services/RestUtilities';
import queryString from 'query-string';
import isEmail from 'validator/lib/isEmail';
import LoginLayout from '../common/LoginLayout';
import { useStyles, regexEx } from '../common/Common';

export default function ResetPassword(props) {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [code, setCode] = useState('');
  const [disabled, setDisabled] = useState(false);

  if (!code) {
    const search = props.location.search;
    const parsed = queryString.parse(search);
    setCode(parsed.code);
  }

  var isPasswordInvalid = password && !regexEx.test(password);

  function handleResetPasswordClick() {
    setDisabled(true);
    const url = '/api/auth/ResetPassword';
    const data = { email, password, code };
    RestUtilities.post(url, data).then(async response => {
      if (response.ok) {
        props.history.push('/login');
      } else {
        setError(true);
      }
    });
  }

  return (
    <LoginLayout>
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
              error={isEmailInvalid}
              helperText={isEmailInvalid && 'Not an email address.'}
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
              error={isPasswordInvalid}
              helperText={isPasswordInvalid && 'Must include 1 number, 1 uppercase leter, 1 lowercase letter and 1  special character'}
              disabled={disabled}
            />
          </Grid>
        </Grid>
        <Button fullWidth variant='contained' color='primary' className={classes.submit} onClick={() => handleResetPasswordClick()} disabled={disabled}>
          Reset Password
        </Button>
        {error && (
          <Grid container>
            <Grid item xs={12}>
              <Typography component='p'>Something went wrong.</Typography>
            </Grid>
          </Grid>
        )}
        <Grid container justify='flex-end'>
          <Grid item xs>
            <Link to={'/forgotPassword'}>Forgot password?</Link>
          </Grid>
          <Grid item>
            <Link to={'/login'}>Already have an account? Sign in</Link>
          </Grid>
        </Grid>
      </form>
    </LoginLayout>
  );
}
