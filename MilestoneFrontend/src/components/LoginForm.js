import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
    
        this.handleChange = this.handleChange.bind(this);
    
        this.state = {
            userEmail: '',
            userPassword: '',
            value: ''
        };
    }
  
    getValidationState() {
        const length = this.state.userEmail.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
        return null;
    }
  
    handleChange(e) {
      this.setState({ userEmail: e.target.value });
    }
  
    render() {
        return (
            <div className="container">
                <h1>
                    Welcome to Milestone!
                </h1>
                <br />
                <br />

                <form>
                    <FormGroup
                        controlId="formBasicText"
                        validationState={this.getValidationState()}
                    >
                        <ControlLabel>
                            Email:
                        </ControlLabel>
                        <FormControl
                            type="email"
                            value={this.state.userEmail}
                            placeholder="email@address.com"
                            onChange={this.handleChange}
                        />
                        <br />
                        <ControlLabel>
                            Password:
                        </ControlLabel>
                        <FormControl
                            type="password"
                            value={this.state.userPassword}
                            placeholder=""
                            // onChange={this.handleChange}
                        />
                        <FormControl.Feedback />
                        {/* <HelpBlock>Validation is based on string length.</HelpBlock> */}
                    </FormGroup>
                    <Button>
                        Login
                    </Button>  
                </form>        
            </div>
        );
    }
}
  
export default LoginForm;