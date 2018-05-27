/////////////////////////////////////////
/// Dev Notes

/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { Form, Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
/////////////////////////////////////////
/// Standard Components

/////////////////////////////////////////
/// Images & Styles
import logo from '../../img/logo.png';
import '../../css/LoginForm.css';

/////////////////////////////////////////
/// Code

//handles logging users in
function LoginForm(props) {

    function attemptLogIn(e) {
        e.preventDefault();
        let email = document.getElementById("formHorizontalEmail").value;
        let password = document.getElementById("formHorizontalPassword").value;
        props.userController.logIn(email, password)
        .then((data) => {
            props.logIn();
        })
    }

    return props.userLoggedIn ? (
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
                                    placeholder="Email" 
                                    className="c-login-form__input" 
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="formHorizontalPassword">
                            <Col componentClass={ControlLabel} sm={12} className="c-login-form__label">
                                Password
                            </Col>
                            <Col sm={12}>
                                <FormControl 
                                    type="password" 
                                    placeholder="Password" 
                                    className="c-login-form__input" 
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col sm={12}>
                                <button className="c-login-form__btn" type="submit" onClick={(e) => attemptLogIn(e)} >Sign in</button>
                            </Col>
                        </FormGroup>
                    </Form>
                </div>
            </div>
            <footer className="c-login-form__footer"><img className="c-login-form__footer__logo" src={logo} alt="Milestone Logo"/>Milestone &copy;2018</footer>
        </div>
    );
}
  
export default LoginForm;