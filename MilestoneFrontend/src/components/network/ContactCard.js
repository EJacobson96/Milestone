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
        this.setContactData(id);
    }

    componentWillReceiveProps(nextProps) {
        var currID = this.props.match.params.id.substring(3, this.props.match.params.id.length)
        var nextID = nextProps.match.params.id.substring(3, nextProps.match.params.id.length)
        if (currID !== nextID) {
            this.setContactData(nextID);
        }
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

    setUserRequests(currUserID, currUserRequests, otherUserID, otherUserRequests) {
        this.props.userController.updateUserRequests(currUserID, currUserRequests)
        .then(data => {
            this.setState({
                currUser: data,
            }, () => {
                this.props.userController.updateUserRequests(otherUserID, otherUserRequests)
                .then(data => {
                    this.setState({
                        contactInfo: data,
                    })
                })
            });
        })
    }

    sendInvite() {
        var currUserRequests = this.state.currUser.pendingRequests;
        var otherUserRequests = this.state.contactInfo.pendingRequests;
        var newRequest = {
            Type: "sent",
            User: this.state.contactInfo.id,
            ContentType: "Connection",
            FullName: this.state.contactInfo.fullName,
            Email: this.state.contactInfo.Email
        };
        currUserRequests.push(newRequest);
        newRequest = {
            Type: "received",
            User: this.state.currUser.id,
            ContentType: "Connection",
            FullName: this.state.currUser.fullName,
            Email: this.state.currUser.Email
        };
        otherUserRequests.push(newRequest);
        this.setUserRequests(this.state.currUser.id, currUserRequests, this.state.contactInfo.id, otherUserRequests);
    }

    approveRequest() {
        var userConnections = this.state.currUser.connections;
        userConnections.push(this.state.contactInfo);
        this.props.userController.addConnection(this.state.currUser.id, userConnections)
            .then(data => {
                this.removeRequests();
            })
    }

    removeRequests() {
        var currUserRequests = this.state.currUser.pendingRequests;
        var otherUserRequests = this.state.contactInfo.pendingRequests;
        currUserRequests = currUserRequests.filter(request => {
            return request.user !== this.state.contactInfo.id;
        });
        otherUserRequests = otherUserRequests.filter(request => {
            return request.user !== this.state.currUser.id;
        });
        this.setUserRequests(this.state.currUser.id, currUserRequests, this.state.contactInfo.id, otherUserRequests);
    }

    pendingRequest(contactID) {
        if (this.state.currUser) {
            var requests = this.state.currUser.pendingRequests;
            for (let i = 0; i < requests.length; i++) {
                if (requests[i].type === "sent" && requests[i].user === contactID) {
                    return "sent"
                } else if (requests[i].type === "received" && requests[i].user === contactID) {
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
                                    <img src={message} alt="messaging icon"/>
                                </div>
                              </div>
            } 
            else if (requestType === "received") {
				contactUser = <div className='c-request-profile__button-wrapper'>
					            <Button className='c-request-profile__button c-request-profile__button--approve' onClick={ () => { this.approveRequest() } }>Confirm</Button>
					            <Button className='c-request-profile__button c-request-profile__button--deny' onClick={ () => { this.removeRequests() } }>Delete Request</Button>
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
                    this.state.currUser &&
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
