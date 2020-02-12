import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { loginStyles } from '../common/Common';
import Layout from './Layout';

function LoginLayout(props) {
  const classes = loginStyles();
  return (
    <Layout>
      <Container maxWidth='sm'>
        <Card>
          <CardContent>
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component='h1' variant='h5' gutterBottom>
                {props.title}
              </Typography>
              {props.children}
            </div>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
}

export default LoginLayout;
