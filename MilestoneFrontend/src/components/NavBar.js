/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { Glyphicon, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Axios from 'axios';

/////////////////////////////////////////
/// Images & Styles
import logo from '../img/logo.png';
import '../css/NavBar.css';

/////////////////////////////////////////
/// Code

class NavBar extends React.Component {
    constructor(props) {
        super(props);
    
        this.openSideBar = this.openSideBar.bind(this);
    
        this.state = {
            value: ''
        };
    }

    componentDidMount() {
        this.getCurrentUser();
    }

    openSideBar(e) {
        e.preventDefault();
        
        this.props.openSideBar();
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
        var notifications = 0;
        var displayNotifications;
        if (this.state.userData) {
            console.log(this.state.userData);
            for (let i = 0; i < this.state.userData.notifications.length; i++) {
                console.log(this.state.userData.notifications[i].read);
                if (this.state.userData.notifications[i].read == false) {
                    notifications += 1;
                }
            }
            console.log(notifications.length);
            if (notifications > 0) {
                console.log("hello");
                displayNotifications = <Badge>{notifications}</Badge>
            }
        }
        return (
            <div className="c-navbar">
                <Button bsSize="lg" onClick={(e) => this.openSideBar(e)} className="c-navbar__btn">
                    <Glyphicon glyph="menu-hamburger" />
                </Button>
                <div className="c-navbar__logo-wrapper">
                    <Link to="/Network">
                        <div className="c-navbar-logo-container">
                            <img src={ logo } className="c-navbar__logo-img" alt="Milestone Logo" />
                        </div>
                    </Link>
                </div>
                <Link to="/Notifications" className="c-navbar__btn">
                    <Glyphicon glyph="bell" />
                    {displayNotifications}
                </Link>
                <Button bsSize="lg" className="c-navbar__btn">
                    <Glyphicon glyph="user" />                
                </Button>
            </div>
        );
    }
}

export default NavBar;