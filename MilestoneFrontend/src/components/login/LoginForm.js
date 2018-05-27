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
        //Select form inputs and labels
        var password = document.querySelector('input[type=password]');
        var email = document.querySelector('input[type=email]');
        var inputs = document.getElementsByTagName('input');
        var warnings = document.getElementsByClassName('validationWarning');
        //Form validation
        for(var i = 0; i < inputs.length; i++) {
            if(inputs[i].value === '' && !inputs[i].classList.contains('invalid')) {
                //If input is empty
                inputs[i].classList.add('invalid');
                warnings[i].classList.add('show');
                warnings[i].classList.remove('hide');
                //Hide password length warning label
                warnings[2].classList.remove('show')
                warnings[2].classList.add('hide')
            } else if(inputs[i].classList.contains('invalid') && inputs[i].value !== '') {
                //If input was empty and know is not
                inputs[i].classList.remove('invalid');
                warnings[i].classList.remove('show');
                warnings[i].classList.add('hide');
                //Hide password length warning label
                warnings[2].classList.remove('show')
                warnings[2].classList.add('hide')
            }
        }
        if(password.value.length > 0 && password.value.length < 6) {
            //If password length is less than 6 charcters
            warnings[2].classList.add('show');
            warnings[2].classList.remove('hide');
            warnings[1].classList.add('hide');
            warnings[1].classList.remove('show');
        }
        props.userController.logIn(email.value, password.value)
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
                                    placeholder="Password" 
                                    className="c-login-form__input" 
                                    required
                                />
                                <label className="validationWarning hide">Please provide a password</label>
                                <label className="validationWarning hide">Password must be at least 6 characters long</label>
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col sm={12}>
                                <button className="c-login-form__btn" type="submit" onClick={(e) => attemptLogIn(e)}>Sign in</button>
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