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
                <Route path='/network' render={(props) => (
                    <Network 
                        messageController = { this.props.messageController }
                        userController = { this.props.userController }
                    />
                )} />
                <Route path='/calendar' render={(props) => (
                    <Placeholder />
                )} />
                <Route path='/progress' render={(props) => (
                    <ProgressController 
                        goalController= { this.props.goalController }
                        userController = { this.props.userController }
                    />
                )} />
                <Route path='/requests' render={(props) => (
                    <Placeholder />
                )} />
                <Route path='/notifications' render={(props) => (
                    <Notification 
                        userController = { this.props.userController }
                     />
                )} />
                <Route exact path="/" render={(props) => (
                    <Redirect to="/progress" />
                )} />
            </Switch>
        ) : (
            <Redirect to="/login" />
        );
    } 
}
  
export default Main;