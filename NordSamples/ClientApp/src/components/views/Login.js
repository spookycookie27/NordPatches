import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { setToken } from '../../services/Auth';
import RestUtilities from '../../services/RestUtilities';
import { Copyright, useStyles } from '../common/Common';

export default function SignInSide(props) {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  function handleLoginClick() {
    const url = '/api/auth/login';
    const data = { email: email, password: password };
    RestUtilities.post(url, data).then(async response => {
      if (response.ok) {
        setToken(response.content.token, response.content.tokenExpiry);
        //await this.props.setUser(response.content.user); // TODO do we want to hold user in redux?
        props.history.push('/');
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
            Sign in
          </Typography>
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
                setEmail(event.target.value);
                setError(false);
              }}
              error={error}
              helperText={error && 'This email and password combination is not recognised'}
            />
            <TextField
              variant='outlined'
              value={password}
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              onChange={event => {
                setPassword(event.target.value);
                setError(false);
              }}
              error={error}
              helperText={error && 'This email and password combination is not recognised'}
            />
            <Button fullWidth variant='contained' color='primary' className={classes.submit} onClick={() => handleLoginClick()}>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to={'/forgotPassword'}>Forgot password?</Link>
              </Grid>
              <Grid item>
                <Link to={'/register'}>{"Don't have an account? Sign Up"}</Link>
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
