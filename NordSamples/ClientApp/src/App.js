import React from 'react';
import { Route, Redirect, BrowserRouter, Switch } from 'react-router-dom';
import Layout from './components/common/Layout';
import Login from './components/views/Login';
import Register from './components/views/Register';
import ForgotPassword from './components/views/ForgotPassword';
import ResetPassword from './components/views/ResetPassword';
import Home from './components/views/Home';
import About from './components/views/About';
import AddPatch from './components/views/AddPatch';
import AllPatches from './components/views/AllPatches';
import Files from './components/views/Files';
import { isSignedIn } from './services/Auth';
import ReactGA from 'react-ga';
import WithTracker from './components/common/WithTracker';
import 'typeface-roboto';

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        isSignedIn() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )
      }
    />
  );
};

const App = () => {
  ReactGA.initialize('UA-155257266-1');
  return (
    <div className='App'>
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={WithTracker(Login)} />
          <Route path='/register' component={WithTracker(Register)} />
          <Route
            path='/forgotPassword'
            component={WithTracker(ForgotPassword)}
          />
          <Route path='/resetPassword' component={WithTracker(ResetPassword)} />
          <Layout>
            <Route exact path='/' component={WithTracker(Home)} />
            <PrivateRoute
              exact
              path='/addsound'
              component={WithTracker(AddPatch)}
            />
            <PrivateRoute
              exact
              path='/sounds'
              component={WithTracker(AllPatches)}
            />
            <PrivateRoute exact path='/files' component={WithTracker(Files)} />
            <PrivateRoute exact path='/about' component={WithTracker(About)} />
          </Layout>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
