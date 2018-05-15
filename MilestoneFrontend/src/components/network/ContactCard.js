/////////////////////////////////////////
/// Pre-baked Component
import React from 'react';
import { Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components

import HeaderBar from '../ux/HeaderBar';

/////////////////////////////////////////
/// Images & Styles
import message from '../../img/messagebubble.png';
import phone from '../../img/phoneicon.png';
import fakeuser from '../../img/fakeuser.png';
import '../../css/ContactCard.css';

/////////////////////////////////////////
/// Code

class ContactCard extends React.Component {
    constructor(props) {
        super(props);
    }

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
        console.log(this.props.messageContent);
    }

    setContactData(id) {
        this.props.userController.getContact(id)
        .then(data => {
            this.setUserData(data);
        })
    }

    setUserData(contactInfo) {
        this.props.userController.getUser()
            .then(data => {
                this.setState({
                    contactInfo: contactInfo,
                    currUser: data
                });
            })
    }

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
                                "/Network/Contacts/Profile/:id" + currentUser.id, otherUserID);
                        }
                    })
                })
            });
        })
    }

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
                console.log("Adding connection: " + data)
                this.props.userController.addConnection(this.state.contactInfo.id, otherConnections)
                .then(data => {
                    console.log("Adding connection: " + data + "removing connection");
                    this.removeRequests(this.state.currUser.fullName + " has accepted your invitiation to connect.");
                })
            })
    }

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
                console.log(data);
            })
        }
    }

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

    handleMessaging() {
        console.log(this.props.messageContent)
        let conversations = this.props.messageContent;
        let existing = false;
        let conversationID;
        for (let i = 0; i < conversations.length; i++) {
            for (let j = 0; j < conversations[i].members.length; j++) {
                if (conversations[i].members[j].id == this.state.contactInfo.id) {
                    existing = true;
                    conversationID = conversations[i].id;
                }
            }
        }
        if (existing) {
            this.props.history.push('/Network/Messages/Conversation/:id' + conversationID)
        } else {
            this.props.history.push('/Network/Messages/New/' + this.state.contactInfo.id)
        }
    }

    render() {
        var name, 
        email,
        contactUser,
        requestType;
        if (this.state && this.state.contactInfo) {
            name = <HeaderBar
                        text={this.state.contactInfo.fullName}
                    />
            email = this.state.contactInfo.email;
            requestType = this.pendingRequest(this.state.contactInfo.id);
            if (this.isConnected(this.state.contactInfo.id)) {
                contactUser = <div className='c-contact-profile__contact-icons'>
                                <div className='c-contact-profile__contact-icons__phone'>
                                    <a href="tel:5555555555"><img src={phone} alt="phone icon"/></a>
                                </div>
                                <div className='c-contact-profile__contact-icons__msg'> 
                                    <Button onClick={ () => { this.handleMessaging() } }>
                                        <img src={message} alt="messaging icon"/> 
                                    </Button>
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
                            <img src={fakeuser} alt="User Avatar"/>
                        </div>
                        <div className="c-contact-invite">
                            {contactUser}
                        </div>
                        <div className='c-contact-profile__profile-info'>
                            <p className='c-contact-profile__field-label'><strong>Email: </strong>{ email }</p>
                            <h5>Description: </h5>
                            <p>
                                Dolore do eiusmod sit qui veniam cillum. Cupidatat qui excepteur magna ea laboris. 
                                Consequat tempor dolor eiusmod consectetur. Id aliquip voluptate ea minim non pariatur 
                                minim aliqua pariatur reprehenderit pariatur sint. Mollit cillum ea adipisicing velit eu 
                                voluptate ipsum velit fugiat sint minim est minim elit.
                            </p>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default withRouter(ContactCard);
