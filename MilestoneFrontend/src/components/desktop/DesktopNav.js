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
const websocket = new WebSocket("wss://milestoneapi.eric-jacobson.me/ws");

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
      if (notifications[i].contentType === "new message") {
        notifications[i].read = true;
      }
    }
    this.props.userController.postNotification(notifications, this.state.user.id)
      .then((data) => {
        console.log(data);
        this.setState({
          user: data,
        })
      });
  }

  clearNotifications() {
    let notifications = this.state.user.notifications;
    for (let i = 0; i < notifications.length; i++) {
      if (notifications[i].contentType === "connection") {
        notifications[i].read = true;
      }
    }
    this.props.userController.postNotification(notifications, this.state.user.id)
      .then((data) => {
        console.log(data);
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
    // var displayNetworkBadge;
    var notificationComponent;
    if (this.state && this.state.user) {
      for (let i = 0; i < this.state.user.notifications.length; i++) {
        if (this.state.user.notifications[i].read == false && this.state.user.notifications[i].contentType == "connection") {
          notifications += 1;
        }
      }
      // for (let i = 0; i < this.state.user.notifications.length; i++) {
      //   console.log("test");
      //   if (this.state.user.notifications[i].read == false && this.state.user.notifications[i].contentType == "new message") {
      //     networkAlerts += 1;
      //   }
      // }
      console.log(networkAlerts);
      if (notifications > 0) {
        displayNotifications = <Badge className="c-notification-badge" >{notifications}</Badge>
      }
      // if (networkAlerts > 0) {
      //   displayNetworkBadge = <Badge className="c-notification-badge" >{networkAlerts}</Badge>
      // }
      notificationComponent = <Notification userController = { this.props.userController } isDropdown = {true}/>
    }
    return (
      <div className="c-navbar">
        <div className="container c-navbar__desktop-nav-container">
          <Link to="/Network">
            <img src={logo} className="milestoneLogo" alt="Milestone Logo" />
          </Link>
          <Link className="navLink" to='/Network'>
            {/* <div className="c-navbar__btn c-link-notifications"> */}
              <i className="fas fa-comments"></i>
              {/* {displayNetworkBadge} */}
            {/* </div> */}
            <p>Network</p>
          </Link>
          {/* <Link className="navLink" to='/Calendar'>
            <i className="far fa-calendar"></i>
            <p>Calendar</p>
          </Link> */}
          <Link className="navLink" to='/Progress'>
            <i className="fas fa-flag"></i>
            <p>Progress</p>
          </Link>
          {/* <Link className="navLink" to='/Requests'>
            <i className="far fa-paper-plane"></i>
            <p>Requests</p>
          </Link> */}
          <div className="dropdown dropleft notificationDropdown">
            <Button className="c-navbar__btn c-link-notifications" data-toggle="dropdown" 
                aria-haspopup="true" aria-expanded="false" onClick={(e) => this.clearNotifications(e)}>
              <i className="fas fa-bell"></i>
              {displayNotifications}
            </Button>
            <div className="dropdown-menu p-4">
              {notificationComponent}
              <div className="text-center mt-2">
                <Link to='/Notifications'>See All</Link>
              </div>
            </div>
          </div>
          <div className="dropdown userDropdown">
            <Button bsSize="lg" className="c-navbar__btn dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i className="fas fa-user"></i>    
            </Button>
            <div className="dropdown-menu">
              <a className="dropdown-item" href="#">Profile</a>
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