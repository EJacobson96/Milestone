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

class DesktopNav extends React.Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    this.setUserData();
  }

  setUserData() {
    this.props.userController.getUser()
    .then((data) => {
      this.setState({
        user: data,
      })
    })
  }

  clearNotifications() {
    let notifications = this.state.user.notifications;
    for (let i = 0; i < notifications.length; i++) {
      notifications[i].read = true;
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
    var displayNotifications;
    var notificationComponent;
    if (this.state && this.state.user) {
      for (let i = 0; i < this.state.user.notifications.length; i++) {
        if (this.state.user.notifications[i].read == false) {
          notifications += 1;
        }
      }
      if (notifications > 0) {
        displayNotifications = <Badge className="c-notification-badge" >{notifications}</Badge>
      }
      notificationComponent = <Notification userController = { this.props.userController } isDropdown = {true}/>
    }
    return (
      <div className="c-navbar">
        <div className="container c-navbar__desktop-nav-container">
          <Link to="/Network">
            <img src={logo} className="milestoneLogo" alt="Milestone Logo" />
          </Link>
          <Link className="navLink" to='/Network'>
            <i className="fas fa-comments"></i>
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