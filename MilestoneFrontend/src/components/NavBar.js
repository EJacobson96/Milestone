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
        this.setUserData();
    }

    openSideBar(e) {
        e.preventDefault();
        
        this.props.openSideBar();
    }
      
    setUserData() {
        this.props.userController.getUser()
        .then((data) => {
          this.setState({
            userData: data,
          })
        })
      }

    render() {
        var notifications = 0;
        var displayNotifications;
        if (this.state.userData) {
            for (let i = 0; i < this.state.userData.notifications.length; i++) {
                if (this.state.userData.notifications[i].read == false) {
                    notifications += 1;
                }
            }
            if (notifications > 0) {
                displayNotifications = <Badge className="c-notification-badge">{notifications}</Badge>
            }
        }
        return (
            <div className="c-navbar">
                <Link to="/Network" className="c-navbar__logo-wrapper">
                    <img src={ logo } className="c-navbar__logo-img" alt="Milestone Logo" />
                </Link>
                <Link className="c-navbar__link" to='/Network'>
                    <i className="fas fa-comments"></i>
                </Link>
                <Link className="c-navbar__link" to='/progress'>
                    <i className="fas fa-flag"></i>
                </Link>
                <Link to="/Notifications" className="c-navbar__link c-nav-notifiactions">
                    <i className="fas fa-bell"></i>
                    {displayNotifications}
                </Link>
                <Button bsSize="lg" className="c-navbar__btn">
                    <i className="fas fa-user"></i>             
                </Button>
            </div>
        );
    }
}

export default NavBar;