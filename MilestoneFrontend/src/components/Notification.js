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
            var count = 0;
            notifications = this.props.user.notifications.map((notification) => {
                var body;
                var time;
                var read;
                count++;
                switch (notification.contentType) {
                    case "new message":
                        body = 'Bob sent you a message: "' + notification.body + '"';
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
                        pathname: "",
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