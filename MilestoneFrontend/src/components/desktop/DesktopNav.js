/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Glyphicon, Button, Badge } from 'react-bootstrap';

/////////////////////////////////////////
/// Images & Styles
import logo from '../../img/logo.png';
import '../../css/DesktopNav.css';
import Notification from '../Notification.js';

/////////////////////////////////////////
/// Code
const websocket = new WebSocket("wss://api.milestoneapp.org/ws");

class DesktopNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.setUserData();
    websocket.addEventListener("message", function(event) { 
      var data = JSON.parse(event.data);
      if (this.state.currUser && data.payload.id == this.state.currUser.id) {
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

  logOut(e) {
    this.props.userController.logOut();
    this.props.history.push('/login');
  }

  render() {
    var notifications = 0;
    var networkAlerts = 0;
    var displayNotifications;
    var displayNetworkBadge;
    var notificationComponent;
    if (this.state && this.state.user) {
      for (let i = 0; i < this.state.user.notifications.length; i++) {
        if (this.state.user.notifications[i].read == false) {
          if (this.state.user.notifications[i].contentType == "connection" || this.state.user.notifications[i].contentType == "goal") {
            notifications += 1;
          } else if (this.state.user.notifications[i].contentType == "message") {
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
              <button className="dropdown-item" onClick={(e) => this.logOut(e)}>Log Out</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(DesktopNav);