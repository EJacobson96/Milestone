/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import Notification from './Notification.js';
import MediaQuery from 'react-responsive';

/////////////////////////////////////////
/// Images & Styles
import logo from '../img/logo.png';
import '../css/NavBar.css';

/////////////////////////////////////////
/// Code
//initalizes websocket to update nav bar when any changes have been made
const websocket = new WebSocket("wss://api.milestoneapp.org/ws");

//displays main nav bar
class NavBar extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            value: ''
        };
    }

    componentDidMount() {
        this.setUserData();
        //updates nav bar for network and notification alerts
        websocket.addEventListener("message", function(event) { 
          var data = JSON.parse(event.data);
          if (this.state.user && data.payload.id === this.state.user.id) {
              this.setUserData();
          }
        }.bind(this)); 
      }
    
    setUserData() {
        this.props.userController.getUser()
        .then((data) => {
            this.setState({
                    user: data,
            })
        })
    }
    
    //clears alert bell when user clicks on network
    clearNetwork() {
    let notifications = this.state.user.notifications;
    for (let i = 0; i < notifications.length; i++) {
        if (notifications[i].contentType === "message") {
            notifications[i].read = true;
        }
    }
    this.props.userController.postNotification(notifications, this.state.user.id)
        .then((data) => {
        this.setState({
            user: data,
        })
        });
    }
    
    //clears notification bell when user clicks on notifications
    clearNotifications() {
    let notifications = this.state.user.notifications;
        for (let i = 0; i < notifications.length; i++) {
        if (notifications[i].contentType === "connection" || notifications[i].contentType === "goal") {
            notifications[i].read = true;
        }
        }
        this.props.userController.postNotification(notifications, this.state.user.id)
        .then((data) => {
            this.setState({
            user: data,
            })
        });
    }

    render() {
        var notifications = 0;
        var networkAlerts = 0;
        var displayNotifications;
        var displayNetworkBadge;
        var notificationComponent;
        if (this.state && this.state.user) {
            for (let i = 0; i < this.state.user.notifications.length; i++) {
                if (this.state.user.notifications[i].read === false) {
                    if (this.state.user.notifications[i].contentType === "connection" || 
                                this.state.user.notifications[i].contentType === "goal") {
                        notifications += 1;
                    } else if (this.state.user.notifications[i].contentType === "message") {
                        networkAlerts += 1;
                    }
                }
            }
            if (notifications > 0) {
                displayNotifications = <Badge className="c-notification-badge" >{notifications}</Badge>
            }
            if (networkAlerts > 0) {
                displayNetworkBadge = <Badge className="c-notification-badge" >{networkAlerts}</Badge>
            }
              notificationComponent = <Notification userController = { this.props.userController } isDropdown = {true}/>
        }
        return (
            <div>
                {
                <div>
                    <MediaQuery query="(max-width: 769px)">
                        <div className="c-navbar">
                            <Link to="/network" className="c-navbar__logo-wrapper">
                                <img src={ logo } className="c-navbar__logo-img" alt="Milestone Logo" />
                            </Link>
                            <Link className="c-navbar__link" to='/network'>
                                <i className="fas fa-comments"></i>
                            </Link>
                            <Link className="c-navbar__link" to='/progress'>
                                <i className="fas fa-flag"></i>
                            </Link>
                            <Link to="/notifications" className="c-navbar__link c-nav-notifiactions">
                                <i className="fas fa-bell"></i>
                                {displayNotifications}
                            </Link>
                            <Link to="/profile" className="c-navbar__link">
                                <i className="fas fa-user"></i>             
                            </Link>
                        </div>
                    </MediaQuery>
                    <MediaQuery query="(min-width: 769px)">	 
                        <div className="c-navbar">
                            <div className="container c-navbar__desktop-nav-container">
                                <Link to="/network">
                                    <img src={logo} className="milestoneLogo" alt="Milestone Logo" />
                                </Link>
                                <Link className="navLink" to='/network' onClick={(e) => this.clearNetwork(e)}>
                                    <div className="c-navbar__btn c-link-notifications">
                                        <i className="fas fa-comments"></i>
                                    {displayNetworkBadge}
                                    
                                    </div>
                                    <p>Network</p>
                                </Link>
                                <Link className="navLink" to='/progress'>
                                    <i className="fas fa-flag"></i>
                                    <p>Progress</p>
                                </Link>
                                <div className="dropdown dropleft notificationDropdown">
                                    <Button className="c-navbar__btn c-link-notifications" data-toggle="dropdown" 
                                        aria-haspopup="true" aria-expanded="false" onClick={(e) => this.clearNotifications(e)}>
                                        <i className="fas fa-bell"></i>
                                    {displayNotifications}
                                    
                                    </Button>
                                    <div className="dropdown-menu p-4">
                                    {notificationComponent}
                                    
                                        <div className="text-center mt-2">
                                            <Link to='/notifications'>See All</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="dropdown userDropdown">
                                    <Button bsSize="lg" className="c-navbar__btn dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="fas fa-user"></i>
                                    </Button>
                                    <div className="dropdown-menu">
                                        <Link className="dropdown-item" to="/profile">Profile</Link>
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item" onClick={() => this.props.logOut()}>Log Out</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MediaQuery>
                </div>
                }
            </div>
        );
    }
}

export default withRouter(NavBar);