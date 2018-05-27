/////////////////////////////////////////
/// Pre-baked Component
import React from 'react';
import { Button } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components

import HeaderBar from '../ux/HeaderBar';

/////////////////////////////////////////
/// Images & Styles
import message from '../../img/messagebubble.png';
import phone from '../../img/phoneicon.png';
import '../../css/network/ContactCard.css';

/////////////////////////////////////////
/// Code

//handles functionality for sending, accepting and denying connection requests with a contact
class ContactCard extends React.Component {

    componentDidMount() {
        var id = this.props.match.params.id.substring(3, this.props.match.params.id.length)
        if (id !== "") {
            this.setContactData(id);
        }
    }

    componentWillReceiveProps(nextProps) {
        var currID = this.props.match.params.id.substring(3, this.props.match.params.id.length)
        var nextID = nextProps.match.params.id.substring(3, nextProps.match.params.id.length)
        if (currID !== nextID && nextID !== "") {
            this.setContactData(nextID);
        }
    }

    setContactData(id) {
        this.props.userController.getContact(id)
        .then(data => {
            this.setUserData(data);
        })
    }


    //set the current user and current profile
    setUserData(contactInfo) {
        this.props.userController.getUser()
            .then(data => {
                this.setState({
                    contactInfo: contactInfo,
                    currUser: data
                });
            })
    }

    //updates all user's requests
    setUserRequests(message, currentUser, currUserRequests, otherUserID, otherUserRequests) {
        this.props.userController.updateUserRequests(currentUser.id, currUserRequests)
        .then(data => {
            this.setState({
                currUser: data,
            }, () => {
                this.props.userController.updateUserRequests(otherUserID, otherUserRequests)
                .then(data => {
                    this.setState({
                        contactInfo: data,
                    }, () => {
                        if (message) {
                            this.postNotification(currentUser, currentUser.id, message, "connection", 
                                "/network/contacts/profile/:id" + currentUser.id, otherUserID);
                        }
                    })
                })
            });
        })
    }

    //adds a new invite request from current user to specified contact
    sendInvite() {
        var currUserRequests = this.state.currUser.pendingRequests;
        var otherUserRequests = this.state.contactInfo.pendingRequests;
        var newRequest = {
            Sender: "" + this.state.contactInfo.id,
            TimeSent: new Date(),
            Type: "sent",
            ContentType: "Connection",
        };
        currUserRequests.push(newRequest);
        newRequest = {
            Sender: "" + this.state.currUser.id,
            TimeSent: new Date(),
            Type: "received",
            ContentType: "Connection",
        };
        otherUserRequests.push(newRequest);
        this.setUserRequests(this.state.currUser.fullName + " would like to connect with you.", this.state.currUser, 
            currUserRequests, this.state.contactInfo.id, otherUserRequests);
    }


    //handles accepting a new connection
    approveRequest() {
        var userConnections = this.state.currUser.connections;
        var otherConnections = this.state.contactInfo.connections;
        otherConnections.push({
            ID: this.state.currUser.id + "",
            Email: this.state.currUser.email,
            FirstName: this.state.currUser.firstName,
            LastName: this.state.currUser.lastName,
            FullName: this.state.currUser.fullName
        });
        userConnections.push({
            ID: this.state.contactInfo.id + "",
            Email: this.state.contactInfo.email,
            FirstName: this.state.contactInfo.firstName,
            LastName: this.state.contactInfo.lastName,
            FullName: this.state.contactInfo.fullName
        });
        this.props.userController.addConnection(this.state.currUser.id, userConnections)
            .then(data => {
                this.props.userController.addConnection(this.state.contactInfo.id, otherConnections)
                .then(data => {
                    this.removeRequests(this.state.currUser.fullName + " has accepted your invitiation to connect.");
                })
            })
    }

    //removes the quests when they've either been denied or accepted
    removeRequests(message) {
        var currUserRequests;
        var otherUserRequests;
        currUserRequests = this.state.currUser.pendingRequests.filter(request => {
            return request.sender !== "" + this.state.contactInfo.id;
        });
        otherUserRequests = this.state.contactInfo.pendingRequests.filter(request => {
            return request.sender !== "" + this.state.currUser.id;
        });
        this.setUserRequests(message, this.state.currUser, currUserRequests, this.state.contactInfo.id, otherUserRequests);
    }

    //notifies when a connection was sent or has been accepted
    postNotification(currentUser, creatorID, message, contentType, route, user) {
        var notifications = [];
        var receiver;
        if (this.state.contactInfo) {
            receiver = this.state.contactInfo.id;
            notifications = this.state.contactInfo.notifications
        }
        var newNotification = {
            Sender: "" + currentUser.id,
            TimeSent: new Date(),
            Read: false,
            Body: message,
            ContentType: contentType,
            ContentRoute: route,
        }
        notifications.push(newNotification);
        if (receiver) {
            this.props.userController.postNotification(notifications, receiver)
            .then(data => {
            })
        }
    }

    //checks to see if there is a current pending request with a contact
    pendingRequest(contactID) {
        if (this.state.currUser) {
            var requests = this.state.currUser.pendingRequests;
            for (let i = 0; i < requests.length; i++) {
                if (requests[i].type === "sent" && requests[i].sender === "" + contactID) {
                    return "sent"
                } else if (requests[i].type === "received" && requests[i].sender === "" + contactID) {
                    return "received"
                }
            }
            return "";
        }
    }

    //checks to see if the current user is already connected with the contact
    isConnected(contactID) {
        if (this.state.currUser) {
            var connections = this.state.currUser.connections;
            for (let i = 0; i < connections.length; i++) {
                if (connections[i].id === contactID) {
                    return true;
                }
            }
            return false;
        }
    }

    //redirects user to messaging so they can send contact a message
    handleMessaging(e) {
        e.preventDefault();
        let conversations = this.props.messageContent;
        let existing = false;
        let conversationID;
        for (let i = 0; i < conversations.length; i++) {
            for (let j = 0; j < conversations[i].members.length; j++) {
                if (conversations[i].members[j].id === this.state.contactInfo.id) {
                    existing = true;
                    conversationID = conversations[i].id;
                }
            }
        }
        if (existing) {
            this.props.history.push('/network/messages/conversation/:id' + conversationID)
        } else {
            this.props.history.push('/network/messages/new/' + this.state.contactInfo.id)
        }
    }

    render() {
        var name, 
        email,
        contactUser,
        requestType,
        phoneNum;
        if (this.state && this.state.contactInfo) {
            name = <HeaderBar
                        text={this.state.contactInfo.fullName}
                    />
            phoneNum = this.state.contactInfo.phone[0];
            email = this.state.contactInfo.email;
            requestType = this.pendingRequest(this.state.contactInfo.id);
            if (this.isConnected(this.state.contactInfo.id)) {

                contactUser = <div className='c-contact-profile__contact-icons'>
                                <div className='c-contact-profile__contact-icons__phone'>
                                    <a href={"tel:" + phoneNum}><img src={phone} alt="phone icon"/></a>
                                </div>
                                <div className='c-contact-profile__contact-icons__msg'> 
                                    <Link to="" className="c-profile-messaging-button" onClick={ (e) => { this.handleMessaging(e) } }>
                                        <img src={message} alt="messaging icon"/> 
                                    </Link>
                                </div>
                              </div>
            } 
            else if (requestType === "received") {
				contactUser = <div className='c-request-profile__button-wrapper'>
					            <Button className='c-request-profile__button c-request-profile__button--approve' onClick={ () => { this.approveRequest() } }>Confirm</Button>
					            <Button className='c-request-profile__button c-request-profile__button--deny' onClick={ () => { this.removeRequests("") } }>Delete Request</Button>
				              </div>
            } else if (requestType === "sent") {
                contactUser = <div>
                                <p className='c-request-profile__button--pending'>Request Pending</p>
                              </div>
            } 
            else {
                contactUser = <Button className ="c-contact-invite-button" bsStyle="primary" bsSize="small" onClick={ () => { this.sendInvite() } }>Send Invite</Button>
            }
        }

        return (
            <div className='c-contact-profile'>
                {
                    this.state && this.state.currUser &&
                    <div>
                        {name}          
                        <div className="c-contact-profile__profile-img">
                            <img src={this.state.contactInfo.photoURL} alt="User Avatar"/>
                        </div>
                        <div className="c-contact-invite">
                            {contactUser}
                        </div>
                        <div className='c-contact-profile__profile-info'>
                            <p className='c-contact-profile__field-label'><strong>Email: </strong>{ email }</p>
                            <p><strong>Phone Number: </strong>{phoneNum}</p>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default withRouter(ContactCard);
