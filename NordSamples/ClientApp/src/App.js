import React from 'react';
import { Route, Redirect, BrowserRouter, Switch } from 'react-router-dom';
import Layout from './components/common/Layout';
import Login from './components/views/Login';
import Register from './components/views/Register';
import ForgotPassword from './components/views/ForgotPassword';
import ResetPassword from './components/views/ResetPassword';
import PatchBrowser from './components/views/PatchBrowser';
import { isSignedIn } from './services/Auth';
import 'typeface-roboto';

import './App.css';

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => (isSignedIn() ? <Component {...props} /> : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)} />
  );
};

export default () => (
  <div className='App'>
    <BrowserRouter>
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <Route path='/forgotPassword' component={ForgotPassword} />
        <Route path='/resetPassword' component={ResetPassword} />
        <Layout>
          <PrivateRoute exact path='/' component={PatchBrowser} />
        </Layout>
      </Switch>
    </BrowserRouter>
  </div>
);
