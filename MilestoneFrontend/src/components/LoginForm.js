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
import { Redirect } from 'react-router-dom';
import Axios from 'axios';

/////////////////////////////////////////
/// Standard Components

/////////////////////////////////////////
/// Images & Styles
import '../css/LoginForm.css';

/////////////////////////////////////////
/// Code

class LoginForm extends React.Component {
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
                console.log(response);
                return response.data;
            })
            .then(data => {
                console.log(data);
                console.log(typeof(data));
                this.setState({
                    userData: data
                });
                this.props.logIn(true);
            })
            .catch(error => {
                console.log(error);
                this.props.logIn(true);
            }
        );
    }
  
    render() {
        return this.props.userLoggedIn ? (
            <Redirect to="/" />
        ) : (
            <div>
                <div>
                    <h1 className="ms-login-header">
                        Milestone
                    </h1>
                </div>

                <div className="container ms-login-wrapper">
                    <h1 className="ms-login-title">
                        Login
                    </h1>
                    <form>
                        <FormGroup
                            // validationState={this.getValidationState()}
                        >
                            <ControlLabel className="ms-login-label">
                                Username
                            </ControlLabel>
                            <FormControl
                                type="email"
                                value={this.state.userEmail}
                                placeholder=""
                                className="ms-login-input"
                                onChange={(e) => this.handleEmail(e)}
                            />
                            <br />
                            <ControlLabel className="ms-login-label">
                                Password
                            </ControlLabel>
                            <FormControl
                                type="password"
                                value={this.state.userPassword}
                                placeholder=""
                                className="ms-login-input"
                                onChange={(e) => this.handlePassword(e)}
                            />
                            <FormControl.Feedback />
                        </FormGroup>

                        <div className="ms-login-btn-wrapper">
                            <button className="ms-login-btn">CANCEL</button>
                            <button className="ms-login-btn"
                                onClick={(e) => this.attemptLogIn(e)}
                            >LOG IN</button>
                        </div>

                    </form>        
                </div>

            </div>
        );
    }
}
  
export default LoginForm;