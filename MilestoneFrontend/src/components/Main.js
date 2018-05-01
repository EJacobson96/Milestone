/////////////////////////////////////////
/// Dev Notes
/*
 *
 */

/////////////////////////////////////////
/// Pre-baked Components
import React, { Component } from 'react';
import Axios from 'axios';
import { Redirect, Switch, Route } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components
import Network from './network/Network';
import Placeholder from './Placeholder';

/////////////////////////////////////////
/// Images & Styles
import '../css/LoginForm.css';

/////////////////////////////////////////
/// Code

class Main extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return this.props.userLoggedIn ? (
            <Switch>
                <Route path='/Network' render={(props) => (
                    <Network 
                        messageController = { this.props.messageController }
                        userController = { this.props.userController }
                    />
                )} />
                <Route path='/Calendar' render={(props) => (
                    <Placeholder />
                )} />
                <Route path='/Progress' render={(props) => (
                    <Placeholder />
                )} />
                <Route path='/Requests' render={(props) => (
                    <Placeholder />
                )} />
                <Route exact path="/" render={(props) => (
                    <Redirect to="/Network" />
                )} />
            </Switch>
        ) : (
            <Redirect to="/login" />
        );
    } 
}
  
export default Main;