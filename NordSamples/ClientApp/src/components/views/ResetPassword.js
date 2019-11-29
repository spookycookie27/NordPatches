import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import RestUtilities from '../../services/RestUtilities';
import queryString from 'query-string';
import isEmail from 'validator/lib/isEmail';
import { Copyright, useStyles, regexEx } from '../common/Common';

export default function ResetPassword(props) {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const search = props.location.search;
  const parsed = queryString.parse(search);
  const [code, setCode] = useState(parsed.code);
  var isPasswordInvalid = password && !regexEx.test(password);

  function handleResetPasswordClick() {
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
    <Grid container component='main' className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Reset Password
          </Typography>
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
                />
              </Grid>
            </Grid>
            <Button fullWidth variant='contained' color='primary' className={classes.submit} onClick={() => handleResetPasswordClick()}>
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
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
