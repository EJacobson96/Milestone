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
  
    // getValidationState() {
    //     const length = this.state.userEmail.length;
    //     if (length > 10) return 'success';
    //     else if (length > 5) return 'warning';
    //     else if (length > 0) return 'error';
    //     return null;
    // }
  
    handleEmail(e) {
      this.setState({ userEmail: e.target.value });
    }
  
    handlePassword(e) {
      this.setState({ userPassword: e.target.value });
    }

    attemptLogIn(e) {
        e.preventDefault();

        Axios.post(
            'https://milestoneapi.eric-jacobson.me/sessions', 
            {
                "Email": this.state.userEmail,
                "Password": this.state.userPassword
            })
            .then(response => {
                console.log(response.headers);
                localStorage.setItem('Authorization', response.headers.authorization);
                // if (response.status < 300) {
                //     localStorage.setItem('Authorization', response.headers("Authorization"));
                // }
                // console.log(response);
                return response.data;
            })
            .then(data => {
                // console.log(data);
                // console.log(typeof(data));
                this.setState({
                    userData: data
                });
                this.props.logIn(true);
            })
            .catch(error => {
                console.log(error);
            }
        );
    }
  
    render() {
        return this.props.userLoggedIn ? (
            // <Redirect to="/"/>
            <Redirect to={{
                pathname: '/'
                // state: { user: this.state.userData }
              }}/>
        ) : (
            <div>
                <h1 className="c-login-header">
                    Milestone
                </h1>
                <div className="[ container ] l-login">
                    <div className="l-login__content">
                        <Form horizontal className="c-login-form">
                            <FormGroup controlId="formHorizontalEmail">
                                <Col componentClass={ControlLabel} sm={2} className="c-login-form__label">
                                    Email
                                </Col>
                                <Col sm={10}>
                                    <FormControl 
                                        type="email" 
                                        value={this.state.userEmail} 
                                        placeholder="Email" 
                                        onChange={(e) => this.handleEmail(e)} 
                                        className="c-login-form__input" 
                                    />
                                </Col>
                            </FormGroup>

                            <FormGroup controlId="formHorizontalPassword">
                                <Col componentClass={ControlLabel} sm={2} className="c-login-form__label">
                                    Password
                                </Col>
                                <Col sm={10}>
                                    <FormControl 
                                        type="password" 
                                        value={this.state.userPassword} 
                                        placeholder="Password" 
                                        onChange={(e) => this.handlePassword(e)} 
                                        className="c-login-form__input" 
                                    />
                                </Col>
                            </FormGroup>

                            <FormGroup>
                                <Col smOffset={2} sm={10}>
                                    <button className="c-login-form__btn" type="submit" onClick={(e) => this.attemptLogIn(e)} >Sign in</button>
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