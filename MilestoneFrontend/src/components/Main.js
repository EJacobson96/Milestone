/////////////////////////////////////////
/// Dev Notes
/*
 *  This component is large, and could probably be refactored into a couple
 *  smaller componenents. ~Iean
 */

/////////////////////////////////////////
/// Pre-baked Components
import React, { Component } from 'react';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components
import Network from './Network';

/////////////////////////////////////////
/// Images & Styles
import '../css/LoginForm.css';

/////////////////////////////////////////
/// Code

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userLoggedIn: this.props.isLoggedIn
        };
        this.getCurrentUser = this.getCurrentUser.bind(this);
        this.getCurrentUser();
    }

    getCurrentUser() {
        Axios.get(
            'https://milestoneapi.eric-jacobson.me/users/me', 
            {
                headers: {
                    'Authorization' : localStorage.getItem('Authorization')
                }    
            })
            .then(response => {
                return response.data;
            })
            .then(data => {
                console.log(data);
                this.setState({
                    userData: data
                });
            })
            .catch(error => {
                console.log(error);
            }
        );
    }

    render() {
        let isLoggedIn = this.props.userLoggedIn;
        if (this.state.userData) {
            return isLoggedIn ? (
                <Network user={this.state.userData} />
            ) : (
                <Redirect to="/login" />
            );
        } else {
            return <h1></h1>
        }


    }
}
  
export default Main;