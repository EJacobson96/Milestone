/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import Axios from 'axios';
import { withRouter, Link } from 'react-router-dom';
import { Glyphicon, Button } from 'react-bootstrap';

/////////////////////////////////////////
/// Standard Components

import ContactThumbnail from './ContactThumbnail';
import HeaderBar from '../ux/HeaderBar';

/////////////////////////////////////////
/// Images & Styles

import '../../css/NewMessage.css';

/////////////////////////////////////////
/// Code

class NewMessage extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            connections: null,
            messageContent: []
        };
		
        this.getUserConnections = this.getUserConnections.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
	}

	componentDidMount() {
        this.getUserConnections('');
        this.setState({
            messageContent: this.props.messageContent
        });
	}
	
	getUserConnections(search) {
        Axios.get(
            'https://milestoneapi.eric-jacobson.me/connections?q=' + search, 
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

    handleSearch(e) {
        e.preventDefault();
        let input = document.getElementById('newMessageSearch');
		let search = input.value;
        this.getUserConnections(search);
    }

    render() {
        console.log(this.props.messageContent);
		var connections = <div></div>;
		if (this.state.connections) {
			connections = this.state.connections.map((connection) => {
				return (
					<ContactThumbnail
						path={ '/Network/Messages/Conversation/:id' + connection.id }
                        id={ connection.id }
                        key={ connection.id }
						fullName={ connection.FullName }
					/>
				);
			});
		}
		var displayConnections = <div className="l-contacts">{ connections }</div>
        return (
			<div className="c-new-message">
                <HeaderBar
                    text={ 'New Message' }
                />
                <div className="c-new-message__search-wrapper">
                    <form className="[ form-inline ] c-new-message__search-form">
                        <input id="newMessageSearch" className="form-control mr-sm-2" type="search" placeholder="Search..." aria-label="Search"/>
                        <Button className="btn btn-outline-success my-2 my-sm-0 c-network-button" onClick={(e) => this.handleSearch(e)}>
                            <Glyphicon glyph="search" /> 
                        </Button>
                    </form>
                </div>

				{ displayConnections }
			</div>
        );
    }
}

export default withRouter(NewMessage);