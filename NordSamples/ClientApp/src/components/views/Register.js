import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ExternalLink from '@material-ui/core/Link';
import RestUtilities from '../../services/RestUtilities';
import isEmail from 'validator/lib/isEmail';
import InlineError from '../common/InlineError';
import LoginLayout from '../common/LoginLayout';
import { loginStyles } from '../common/Common';

export default function SignUp(props) {
  const classes = loginStyles();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [errors, setErrors] = useState(null);
  const isPasswordInvalid = !!(password.length < 5 || password.length > 30);
  const isUsernameInvalid = !!(username.length < 5 || username.length > 16) || /\s/g.test(username);
  const isConfirmPasswordInvalid = !!(confirmPassword !== password);
  const isEmailInvalid = !isEmail(email);
  const isActivationCodeInvalid = !!(activationCode && activationCode.length !== 6);
  const hasErrors = isPasswordInvalid || isUsernameInvalid || isConfirmPasswordInvalid || isEmailInvalid || isActivationCodeInvalid;

  async function handleRegisterClick() {
    const url = '/api/auth/register';
    const data = { email, password, username, activationCode };
    setDisabled(true);
    setFeedback('');
    var response = await RestUtilities.post(url, data);
    if (response.ok) {
      setFeedback('Please check your email to confirm.');
    } else {
      response
        .json()
        .then(res => {
          if (response.ok) {
            setFeedback(response);
            setDisabled(false);
          } else if (response.status === 400) {
            setErrors(res.errors ? res.errors : res);
            setFeedback('There were errors:');
            setDisabled(false);
          } else if (response.status === 401) {
            setFeedback('Oops. Something went wrong');
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
    <LoginLayout title='Register Your Account'>
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
              disabled={disabled}
              error={!!email && isEmailInvalid}
              helperText={!!email && isEmailInvalid && 'Not an email address.'}
            />
          </Grid>
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
              label='Username'
              name='username'
              autoComplete='username'
              onChange={event => {
                setUsername(event.target.value);
                setFeedback(null);
              }}
              disabled={disabled}
              error={!!username && isUsernameInvalid}
              helperText={!!username && isUsernameInvalid && 'Must not contain a space and  be minimum 5 characters and maximum of 16.'}
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
              disabled={disabled}
              error={!!password && isPasswordInvalid}
              helperText={!!password && isPasswordInvalid && 'Must be minimum 5 characters and maximum of 30'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              minLength={5}
              maxLength={30}
              variant='outlined'
              value={confirmPassword}
              margin='normal'
              required
              fullWidth
              name='confirmPassword'
              label={'Confirm Password'}
              type='password'
              id='confirmPassword'
              onChange={event => {
                setConfirmPassword(event.target.value);
                setFeedback(null);
              }}
              error={!!confirmPassword && isConfirmPasswordInvalid}
              helperText={!!confirmPassword && isConfirmPasswordInvalid && 'Passwords must match.'}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant='body2'>
              If you have a Nord User Forum account, please enter the activation code found in your{' '}
              <ExternalLink href='https://www.norduserforum.com/ucp.php?i=164' underline='always' variant='inherit' color='primary' target='_blank'>
                user control panel.
              </ExternalLink>
              This will allow us to verify that you are the owner of the files you previously uploaded. Verified users will have the ability to edit their
              previous files.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              minLength={5}
              maxLength={30}
              variant='outlined'
              value={activationCode}
              margin='normal'
              fullWidth
              name='activationCode'
              label={'NUF Activation Code (optional)'}
              id='activationCode'
              onChange={event => {
                setActivationCode(event.target.value);
                setFeedback(null);
              }}
              error={!!activationCode && isActivationCodeInvalid}
              helperText={!!activationCode && isActivationCodeInvalid && 'Should be 6 characters'}
              disabled={disabled}
            />
          </Grid>
        </Grid>
        <Button
          fullWidth
          variant='contained'
          color='secondary'
          className={classes.submit}
          onClick={() => handleRegisterClick()}
          disabled={disabled || hasErrors}
        >
          Sign Up
        </Button>
        {feedback && (
          <Grid container>
            <Grid item xs={12}>
              <Typography variant='body2'>{feedback}</Typography>
              <InlineError field='username' errors={errors} />
              <InlineError field='email' errors={errors} />
              <InlineError field='password' errors={errors} />
              <InlineError field='activationCode' errors={errors} />
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
