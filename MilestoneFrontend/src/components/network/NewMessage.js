/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import Axios from 'axios';
import { withRouter, Link } from 'react-router-dom';
import { Glyphicon, Button } from 'react-bootstrap';

/////////////////////////////////////////
/// Standard Components

import ContactThumbnail from './ContactThumbnail';

/////////////////////////////////////////
/// Images & Styles

import '../../css/NewMessage.css';
import '../../css/Contacts.css'
// import fakeuser from '../../img/fakeuser.png';

/////////////////////////////////////////
/// Code

class NewMessage extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
			connections: null
        };
		
		this.getUserConnections = this.getUserConnections.bind(this);
	}

	componentDidMount() {
		this.getUserConnections();
	}
	
	getUserConnections() {
        Axios.get(
            'https://milestoneapi.eric-jacobson.me/connections?q=', 
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
                    connections: data
                });
            })
            .catch(error => {
                console.log(error);
            }
        );
    }

    buttonClicked() {
        this.props.history.goBack();
    }

    render() {
		var connections = <div></div>;
		if (this.state.connections) {
			connections = this.state.connections.map((connection) => {
				return (
					<ContactThumbnail
						path={ "/Network/Contacts/Profile/:id" + connection.id }
						id={ connection.id }
						fullName={ connection.FullName }
					/>
				);
			});
		}
		var displayConnections = <div className="l-contacts">{ connections }</div>
        return (
			<div className="c-new-message">
				<div className="c-contact-profile__header">
                    <Button onClick={() => this.buttonClicked()} className="c-contact-profile__header__back-btn">
                        <Glyphicon glyph="chevron-left" />
                    </Button>
					<div className="c-contact-profile__header__profile-name-wrapper">
						<h3 className="c-contact-profile__header__profile-name">New Message</h3>
					</div>
                </div>
				{ displayConnections }
			</div>
        );
    }
}

export default withRouter(NewMessage);