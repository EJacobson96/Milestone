/////////////////////////////////////////
/// Dev Notes
/*
 *  This component is large, and could probably be refactored into a couple
 *  smaller componenents. ~Iean
 */

/////////////////////////////////////////
/// Pre-baked Components
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components
import Placeholder from './Placeholder';

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
    }

    render() {
        let isLoggedIn = this.props.userLoggedIn;
        return isLoggedIn ? (
			<Placeholder />
        ) : (
            <Redirect to="/login" />
        );
    }
}
  
export default Main;