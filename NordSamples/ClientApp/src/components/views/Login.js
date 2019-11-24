import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Col, Row, Form, Button } from 'react-bootstrap';
import * as validator from 'validator';
import { setToken, signOut } from '../../services/Auth';
import RestUtilities from '../../services/RestUtilities';
import { actionCreators } from '../../store/ActionCreators';

class Login extends Component {
  constructor(props) {
    super(props);

    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onLogin = this.onLogin.bind(this);

    this.state = {
      email: '',
      pass: '',
      isEmailValid: false,
      isPassValid: false,
      failedLogin: false
    };
    this.props.setLoading(false);
  }

  componentDidMount() {
    signOut();
  }

  getLoginValidationState() {
    const { email, isEmailValid } = this.state;
    if (isEmailValid) return 'success';
    else if (email.length > 0) return 'error';
    return null;
  }

  getPasswordValidationState() {
    const { pass, isPassValid } = this.state;
    if (isPassValid) return 'success';
    else if (pass.length > 0) return 'error';
    return null;
  }

  isFormValid() {
    return this.state.isEmailValid && this.state.isPassValid;
  }

  onEmailChange(e) {
    const email = e.target.value;
    this.setState({
      email,
      isEmailValid: validator.isEmail(email),
      failedLogin: false
    });
  }

  onPasswordChange(e) {
    const pass = e.target.value;
    this.setState({
      pass,
      isPassValid: validator.isLength(pass, { min: 6, max: 20 }),
      failedLogin: false
    });
  }

  onLogin() {
    const url = '/api/auth/login';
    const data = { email: this.state.email, password: this.state.pass };
    RestUtilities.post(url, data).then(async response => {
      if (response.ok) {
        setToken(response.content.token);
        await this.props.setUser(response.content.user);
        this.props.setArtist(response.content.artist);
        this.props.setGallery(null);
        this.props.setSonglist(null);
        this.props.setMp3s(null);
        this.props.setArtistList(response.content.artistList);
        this.props.history.push('/');
      } else {
        this.setState({
          failedLogin: true
        });
      }
    });
  }

  render() {
    return (
      <Container className='Login'>
        <Row>
          <Col>
            <h1>Welcome back</h1>
            <form className='form'>
              <Form.Group controlId='formLogin'>
                <Form.Label>Email address</Form.Label>
                <Form.Control type='text' value={this.state.email} placeholder='Enter your email' onChange={this.onEmailChange} autoComplete='username email' />
              </Form.Group>
              <Form.Group controlId='formPassword'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  value={this.state.pass}
                  placeholder='Enter your password'
                  onChange={this.onPasswordChange}
                  autoComplete='current-password'
                />
              </Form.Group>
              <div className='button-container'>
                <Form.Group controlId='submitButton'>
                  <Button variant='primary' onClick={this.onLogin} block>
                    Log in
                  </Button>
                </Form.Group>
              </div>
            </form>
          </Col>
        </Row>
        <Row>
          <Col>
            <a href='/identity/account/forgotpassword' className='pull-left'>
              Forgotton Password ?
            </a>
            <a href='/identity/account/register' className='pull-right'>
              Not Registered ?
            </a>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect(
  state => ({ ...state.user }),
  dispatch => bindActionCreators(actionCreators, dispatch)
)(Login);
