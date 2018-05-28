/////////////////////////////////////////
/// Dev Notes

/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { Redirect, Switch, Route, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components
import Network from './network/Network';
import Notification from './Notification';
import ProgressController from './progress/ProgressController';
import Profile from './Profile';
/////////////////////////////////////////
/// Images & Styles

/////////////////////////////////////////
/// Code

//handles main navbar routing
function Main(props) {
        console.log(props)
        return props.userLoggedIn ? (

            <Switch>
                <Route path='/network' render={() => (
                    <Network 
                        messageController = { props.messageController }
                        userController = { props.userController }
                    />
                )} />
                <Route path='/progress' render={() => (
                    <ProgressController 
                        goalController= { props.goalController }
                        userController = { props.userController }
                    />
                )} />
                <Route path='/notifications' render={() => (
                    <Notification 
                        userController = { props.userController }
                     />
                )} />
                <Route path='/profile' render={() => (
                    <Profile 
                        logOut={(e) => props.logOut(e) }
                        userController= { props.userController }
                    />
                )} />
                <Route path="/" render={() => (
                    <Redirect to="/progress" />
                )} />
            </Switch>
        ) : (
            <Redirect to="/login" />
        );
}
  
export default withRouter(Main);