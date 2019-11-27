import React from 'react';
import { Route, Redirect, BrowserRouter, Switch } from 'react-router-dom';
import Login from './components/views/Login';
import Register from './components/views/Register';
import Songlist from './components/views/Songlist';
import { isSignedIn } from './services/Auth';

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
        <PrivateRoute exact path='/' component={Songlist} />
      </Switch>
    </BrowserRouter>
  </div>
);
