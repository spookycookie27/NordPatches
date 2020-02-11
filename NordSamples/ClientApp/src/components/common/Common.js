import React from 'react';
import Typography from '@material-ui/core/Typography';
import { siteName } from '../../Constants';
import { makeStyles } from '@material-ui/core/styles';

export const loginStyles = makeStyles(theme => ({
  root: {
    height: '100vh'
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.primary.main
  }
}));

export function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      {siteName} {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
