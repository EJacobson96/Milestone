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

class Notification extends React.Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        this.setUserData();
      }
    
      setUserData() {
        this.props.userController.getUser()
        .then((data) => {
            console.log(data);
          this.setState({
            user: data,
          })
        })
      }

    render() {
        var notifications;
        if (this.state && this.state.user) {
            var count = 0;
            var numOfNotifications = this.state.user.notifications.length;
            notifications = (this.props.isDropdown ? this.state.user.notifications.slice(numOfNotifications - 5, numOfNotifications) : 
                    this.state.user.notifications).slice(0).reverse().map((notification) => {
                if (notification.contentType !== "new message") {
                    var body;
                    var time;
                    var read;
                    count++;
                    if (notification.contentType) {
                        body = notification.body;
                    }
                    switch (notification.read) {
                        case true:
                            read = "c-notification-card-read"
                        case false: 
                            read = "c-notification-card-not-read"
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
                            <div className={"c-notification-card " + read}>
                                <div className="c-notification-user-avatar">
                                    <img src={fakeuser} alt="User Avatar" />
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