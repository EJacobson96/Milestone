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

        this.state = {
            value: ''
        };
    }

    render() {
        var notifications;
        if (this.props.user) {
            console.log(this.props.user.notifications);
            notifications = this.props.user.notifications.map((notification) => {
                var body;
                var time;
                switch (notification.contentType) {
                    case "new message":
                        body = 'Bob sent you a message: "' + notification.body + '"';
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
                        pathname: "",
                    }}
                    className='c-notification-card-link-wrapper' 
                    key={notification.contentID}
                    >
                        <div className="c-notification-card">
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
            });
        }
        return (
            <div className="l-notifications">
                <h1 className="c-notifications-header">Notifications</h1>
                {notifications}
            </div>
        );
    }
}

export default Notification;