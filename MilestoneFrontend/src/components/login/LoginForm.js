/////////////////////////////////////////
/// Dev Notes
/*
 *  This component is large, and could probably be refactored into a couple
 *  smaller componenents. ~Iean
 */

/////////////////////////////////////////
/// Pre-baked Components
import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { Form, Col } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import Axios from 'axios';

/////////////////////////////////////////
/// Standard Components

/////////////////////////////////////////
/// Images & Styles
import logo from '../../img/logo.png';
import '../../css/LoginForm.css';

/////////////////////////////////////////
/// Code

class LoginForm extends Component {
    constructor(props) {
        super(props);
    
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.attemptLogIn = this.attemptLogIn.bind(this);
    
        this.state = {
            userLoggedIn: null,
            userEmail: '',
            userPassword: '',
            userData: {}
        };
    }

    componentWillMount(props) {
        this.setState({
            userLoggedIn: this.props.userLoggedIn
        });
    }

    handleEmail(e) {
      this.setState({ userEmail: e.target.value });
    }
  
    handlePassword(e) {
      this.setState({ userPassword: e.target.value });
    }

    attemptLogIn(e) {
        e.preventDefault();
        var password = document.querySelector('input[type=password]');
        var inputs = document.getElementsByTagName('input');
        var warnings = document.getElementsByClassName('validationWarning');
        for(var i = 0; i < inputs.length; i++) {
            if(inputs[i].value === '' && !inputs[i].classList.contains('invalid')) {
                inputs[i].classList.add('invalid');
                warnings[i].classList.add('show');
                warnings[i].classList.remove('hide');

                warnings[2].classList.remove('show')
                warnings[2].classList.add('hide')

            } else if(inputs[i].classList.contains('invalid') && inputs[i].value !== '') {
                inputs[i].classList.remove('invalid');
                warnings[i].classList.remove('show');
                warnings[i].classList.add('hide');

                warnings[2].classList.remove('show')
                warnings[2].classList.add('hide')
            }
        }
        if(password.value.length > 0 && password.value.length < 6) {
            password.classList.add('invalid');
            warnings[2].classList.add('show');
            warnings[2].classList.remove('hide');
            warnings[1].classList.add('hide');
            warnings[1].classList.remove('show');
        }


        Axios.post(
            'https://api.milestoneapp.org/sessions', 
            {
                "Email": this.state.userEmail,
                "Password": this.state.userPassword
            })
            .then(response => {
                console.log(response.headers);
                localStorage.setItem('Authorization', response.headers.authorization);
                return response.data;
            })
            .then(data => {
                this.setState({
                    userData: data
                });
                this.props.logIn();
            })
            .catch(error => {
                console.log(error);
            }
        );
    }
  
    render() {
        return this.props.userLoggedIn ? (
            <Redirect to={{
                pathname: '/'
            }}/>
        ) : (
            <div className="c-login">
                <h1 className="c-login-header">
                    Milestone
                </h1>
                <div className="l-login">
                    <div className="l-login__content">
                        <Form horizontal className="c-login-form">
                            <FormGroup controlId="formHorizontalEmail">
                                <Col componentClass={ControlLabel} sm={12} className="c-login-form__label">
                                    Email
                                </Col>
                                <Col sm={12}>
                                    <FormControl 
                                        type="email" 
                                        value={this.state.userEmail} 
                                        placeholder="Email" 
                                        onChange={(e) => this.handleEmail(e)} 
                                        className="c-login-form__input"
                                        required
                                    />
                                    <label className="validationWarning hide">Please provide an email</label>
                                </Col>
                            </FormGroup>

                            <FormGroup controlId="formHorizontalPassword">
                                <Col componentClass={ControlLabel} sm={12} className="c-login-form__label">
                                    Password
                                </Col>
                                <Col sm={12}>
                                    <FormControl 
                                        type="password" 
                                        value={this.state.userPassword} 
                                        placeholder="Password" 
                                        onChange={(e) => this.handlePassword(e)} 
                                        className="c-login-form__input" 
                                        required
                                    />
                                    <label className="validationWarning hide">Please provide a password</label>
                                    <label className="validationWarning hide">Password must be at least 6 characters long</label>
                                </Col>
                            </FormGroup>

                            <FormGroup>
                                <Col sm={12}>
                                    <button className="c-login-form__btn" type="submit" onClick={(e) => this.attemptLogIn(e)}>Sign in</button>
                                </Col>
                            </FormGroup>
                            <Link to="#" className="c-login-form__forgot-password">Forgot your password?</Link>
                        </Form>
                    </div>
                </div>
                <footer className="c-login-form__footer"><img className="c-login-form__footer__logo" src={logo} alt="Milestone Logo"/>Milestone &copy;2018</footer>
            </div>
        );
    }
}
  
export default LoginForm;