import React from 'react';
import { Route, Redirect, BrowserRouter, Switch } from 'react-router-dom';
import Layout from './components/common/Layout';
import Login from './components/views/Login';
import Register from './components/views/Register';
import ForgotPassword from './components/views/ForgotPassword';
import ResetPassword from './components/views/ResetPassword';
import Home from './components/views/Home';
import AddPatch from './components/views/AddPatch';
import PatchBrowser from './components/views/PatchBrowser';
import FileBrowser from './components/views/FileBrowser';
import { isSignedIn } from './services/Auth';
import { GlobalStateProvider } from './State';

import 'typeface-roboto';

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => (isSignedIn() ? <Component {...props} /> : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)} />
  );
};

const App = () => (
  <div className='App'>
    <GlobalStateProvider>
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/forgotPassword' component={ForgotPassword} />
          <Route path='/resetPassword' component={ResetPassword} />
          <Layout>
            <Route exact path='/' component={Home} />
            <PrivateRoute exact path='/addpatch' component={AddPatch} />
            <PrivateRoute exact path='/patches' component={PatchBrowser} />
            <PrivateRoute exact path='/files' component={FileBrowser} />
          </Layout>
        </Switch>
      </BrowserRouter>
    </GlobalStateProvider>
  </div>
);

export default App;
