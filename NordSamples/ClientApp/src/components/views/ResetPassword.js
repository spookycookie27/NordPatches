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
import { loginStyles, regexEx } from '../common/Common';

export default function ResetPassword(props) {
  const classes = loginStyles();
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

  var isPasswordInvalid = !!(password && !regexEx.test(password));

  async function handleResetPasswordClick() {
    setDisabled(true);
    const url = '/api/auth/ResetPassword';
    const data = { email, password, code };
    await RestUtilities.post(url, data)
      .then(() => props.history.push('/login?nufDisabled=true'))
      .catch(() => setError(true));
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
                setError(false);
              }}
              error={isPasswordInvalid}
              helperText={isPasswordInvalid && 'Must include 1 number, 1 uppercase leter, 1 lowercase letter and 1  special character'}
              disabled={disabled}
            />
          </Grid>
        </Grid>
        <Button fullWidth variant='contained' color='secondary' className={classes.submit} onClick={() => handleResetPasswordClick()} disabled={disabled}>
          Reset Password
        </Button>
        {error && (
          <Grid container>
            <Grid item xs={12}>
              <Typography component='p'>Oops. Something went wrong</Typography>
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
