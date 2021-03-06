/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { Link } from 'react-router-dom'

/////////////////////////////////////////
/// Images & Styles
import moment from 'moment';
import '../css/Notification.css';
import fakeuser from '../img/fakeuser.png';

/////////////////////////////////////////
/// Code

//displays all of a user's notifications
class Notification extends React.Component {

    componentDidMount() {
        this.setUserData();
      }
    
      setUserData() {
        var userImages = {};
        var notifications;
        this.props.userController.getUser()
        .then((data) => {
            notifications = data.notifications;
            console.log(notifications);
          this.setState({
            user: data,
          }, () => {
              if (notifications) {
                for (let i = 0; i < notifications.length; i++) {
                    this.props.userController.getContact(notifications[i].sender)
                    .then((data) => {
                        userImages['' + notifications[i].sender] = data.photoURL;
                        this.setState({
                            images: userImages
                        })
                    })
                }
              }
            })
        })
      }

    //displays last 5 notifications in a dropdown
    getLast5() {
        var notifications = [];
        for (let i = this.state.user.notifications.length - 1; i >= 0; i--) {
            if (notifications.length === 5) {
                return notifications;
            } else if (this.state.user.notifications[i].contentType !== "message" && 
                            this.state.user.notifications[i].contentType !== "new message") {
                notifications.push(this.state.user.notifications[i]);
            }
        }
        return notifications
    }

    render() {
        var notifications;
        if (this.state && this.state.user && this.state.images) {
            var count = 0;
            var userImg;
            notifications = (this.props.isDropdown ? this.getLast5().reverse() : 
                    this.state.user.notifications).slice(0).reverse().map((notification) => {
                if (notification.contentType !== "message" && notification.contentType !== "new message") {
                    var body;
                    var time;
                    count++;
                    userImg = this.state.images[notification.sender];
                    if (notification.contentType) {
                        body = notification.body;
                    }
                    time = notification.timeSent;
                    if (moment(time).calendar().startsWith('Today')) {
                        if (moment(time).format('hh:mm A').startsWith('0')) {
                            time = moment(time).format('h:mm A');
                        } else {
                            time = moment(time).format('hh:mm A');
                        }
                    } else if (moment(time).calendar().startsWith('Yesterday')) {
                        time = 'Yesterday';
                    } else {
                        if (moment(time).format('MM/DD/YYYY').startsWith('0')){
                            time = moment(time).format('M/DD/YYYY');
                        } else {
                            time = moment(time).format('MM/DD/YYYY');
                        }
                    }
                    return (
                        <Link 
                        to={{
                            pathname: notification.contentRoute,
                        }}
                        className='c-notification-card-link-wrapper' 
                        key={count}
                        >
                            <div className="c-notification-card c-notification-card-background">
                                <div className="c-notification-user-avatar">
                                    <img src={userImg} alt="User Avatar" />
                                </div>
                                <div className="c-notification-details">
                                    <p className="c-notfication-details-body">{body}</p>
                                    <p>{time}</p>
                                </div>
                            </div>
                        </Link>
                    );
                } 
            });
        }
        return (
            <div className="l-notifications">
                <h1 className={this.props.isDropdown ? "c-notifications-dropdown-header" : "c-notifications-header"}>Notifications</h1>
                {notifications}
            </div>
        );
    }
}

export default Notification;