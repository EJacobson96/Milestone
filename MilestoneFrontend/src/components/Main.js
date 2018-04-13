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
import Progress from './progress/Progress'
import Placeholder from './Placeholder';

/////////////////////////////////////////
/// Images & Styles
import '../css/LoginForm.css';

/////////////////////////////////////////
/// Code

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userLoggedIn: this.props.isLoggedIn
        };

        // this.getCurrentUser = this.getCurrentUser.bind(this);
    }
    
    componentDidMount() {
        // this.getCurrentUser();
    }

    // getCurrentUser() {
    //     Axios.get(
    //         'https://milestoneapi.eric-jacobson.me/users/me', 
    //         {
    //             headers: {
    //                 'Authorization' : localStorage.getItem('Authorization')
    //             }    
    //         })
    //         .then(response => {
    //             return response.data;
    //         })
    //         .then(data => {
    //             console.log(data);
    //             this.setState({
    //                 userData: data
    //             });
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         }
    //     );
    // }

    render() {
        let isLoggedIn = this.props.userLoggedIn;
        return isLoggedIn ? (
            <Switch>
                <Route path='/Network' render={(props) => (
                    <Network 
                        // user={ this.state.userData }
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