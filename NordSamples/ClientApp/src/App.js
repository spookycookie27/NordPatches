import React from 'react';
import { Route, Redirect, BrowserRouter, Switch } from 'react-router-dom';
import Login from './components/views/Login';
import Register from './components/views/Register';
import ForgotPassword from './components/views/ForgotPassword';
import ResetPassword from './components/views/ResetPassword';
import PatchList from './components/views/PatchList';
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
        <PrivateRoute exact path='/' component={PatchList} />
      </Switch>
    </BrowserRouter>
  </div>
);
