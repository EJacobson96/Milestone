/////////////////////////////////////////
/// Pre-baked Component
import React from 'react';
import Axios from 'axios';
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
        this.state = { };
    }

    componentDidMount() {
        var id = this.props.match.params.id.substring(3, this.props.match.params.id.length)
        Axios.get(
            'https://milestoneapi.eric-jacobson.me/contact/?id=' + id, 
            {
                headers: {
                    'Authorization' : localStorage.getItem('Authorization')
                }    
            })
            .then(response => {
                return response.data;
            })
            .then(data => {
                this.getCurrentUser(data);
            })
            .catch(error => {
                console.log(error);
            }
        );
    }

    getCurrentUser(contactInfo) {
        Axios.get(
            'https://milestoneapi.eric-jacobson.me/users/me', 
            {
                headers: {
                    'Authorization' : localStorage.getItem('Authorization')
                }    
            })
            .then(response => {
                return response.data;
            })
            .then(data => {
                console.log(data);
                this.setState({
                    contactInfo: contactInfo,
                    userData: data
                });
            })
            .catch(error => {
                console.log(error);
            }
        );
    }

    componentWillUnmount() {
    }

    componentWillReceiveProps(nextProps) {
        var currID = this.props.match.params.id.substring(3, this.props.match.params.id.length)
        var nextID = nextProps.match.params.id.substring(3, nextProps.match.params.id.length)
        if (currID !== nextID) {
            Axios.get(
                'https://milestoneapi.eric-jacobson.me/contact/?id=' + nextID, 
                {
                    headers: {
                        'Authorization' : localStorage.getItem('Authorization')
                    }    
                })
                .then(response => {
                    return response.data;
                })
                .then(data => {
                    console.log(data);
                    this.setState({
                        contactInfo: data
                    });
                })
                .catch(error => {
                    console.log(error);
                }
            );
        }
    }

    isConnected(userId) {
        var connections = this.state.userData.connections;
        for (let i = 0; i < connections.length; i++) {
            if (connections[i].id === userId) {
                return true;
            }
        }
        return false;
    }

    buttonClicked() {
        this.props.history.goBack();
    }

    render() {
        var name;
        var email;
        var contactUser;
        if (this.state.contactInfo) {
            name = <HeaderBar
                        text={this.state.contactInfo.FullName}
                    />
            email = this.state.contactInfo.email;
            if (this.isConnected(this.state.contactInfo.id)) {
                contactUser = <div className='c-contact-profile__contact-icons'>
                                <div className='c-contact-profile__contact-icons__phone'>
                                    <a href="tel:5555555555"><img src={phone} alt="phone icon"/></a>
                                </div>
                                <div className='c-contact-profile__contact-icons__msg'> 
                                    <img src={message} alt="messaging icon"/>
                                </div>
                              </div>
            } else {
                contactUser = <Button className ="c-contact-invite-button" bsStyle="primary" bsSize="small">Send Invite</Button>
            }
        }

        return (
            <div className='c-contact-profile'>
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
        );
    }
}

export default withRouter(ContactCard);