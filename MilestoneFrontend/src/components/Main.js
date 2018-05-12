/////////////////////////////////////////
/// Dev Notes
/*
 *
 */

/////////////////////////////////////////
/// Pre-baked Components
import React, { Component } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import MediaQuery from 'react-responsive';

/////////////////////////////////////////
/// Standard Components
import Network from './network/Network';
import Notification from './Notification';
import ProgressController from './progress/ProgressController';
import Placeholder from './Placeholder';

/////////////////////////////////////////
/// Images & Styles
import '../css/LoginForm.css';

/////////////////////////////////////////
/// Code

class Main extends Component {

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
                <Route path='/progress' render={(props) => (
                    <ProgressController />
                )} />
                <Route path='/Requests' render={(props) => (
                    <Placeholder />
                )} />
                <Route path='/Notifications' render={(props) => (
                    <Notification 
                        userController = { this.props.userController }
                     />
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