/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import Axios from 'axios';
import { withRouter, Link } from 'react-router-dom';
import { Glyphicon, Button } from 'react-bootstrap';

/////////////////////////////////////////
/// Standard Components

import NewMessageThumbnail from './NewMessageThumbnail';
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
            messageContent: [],
            currUser: this.props.user
        };
		
        // this.getUserConnections = this.getUserConnections.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
	}

	componentDidMount() {
        // this.getUserConnections('');
        this.setState({
            connections: this.props.user.connections,
            messageContent: this.props.messageContent

        });
	}
	
	// getUserConnections(search) {
    //     Axios.get(
    //         'https://milestoneapi.eric-jacobson.me/connections?q=' + search + "&id=" + this.state.currUser.id, 
    //         {
    //             headers: {
    //                 'Authorization' : localStorage.getItem('Authorization')
    //             }    
    //         })
    //         .then(response => {
    //             return response.data;
    //         })
    //         .then(data => {
    //             console.log(data);
    //             this.setState({
    //                 connections: data
    //             });
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         }
    //     );
    // }

    renderConversations(messages) {

    }

    handleSearch(e) {
        e.preventDefault();
        let input = document.getElementById('newMessageSearch');
		let search = input.value;
        this.getUserConnections(search);
    }

    handleChange(e) {
        e.preventDefault();
        var input = e.target.value;
        var names = input.replace(/\s+/g, '').split(",");
        var filteredConversations = [];
        var conversations = this.state.messageContent;
        var existingConversation = false;
        if (input != "") {
            for (var i = 0; i < conversations.length; i++) {
                for (var j = 0; j < names.length; j++) {
                    for (var k = 0; k < conversations[i].members.length; k++) {
                        if (conversations[i].members[k].fullName.toLowerCase().includes(names[j].toLowerCase())) {
                            k = conversations[i].members.length;
                        } else if (k == conversations[i].members.length - 1) {
                            j = names.length;
                        }
                    }
                    if (j === names.length - 1) {
                        if (names.length === conversations[i].members.length) {
                            existingConversation = true;
                        }
                        filteredConversations.push(conversations[i]);
                    }
                }
            }
        }
        this.setState({
            existingConversationsList: filteredConversations,
            checkConversation: existingConversation,
        });
        // console.log(filteredConversations);
    }

    render() {
        // console.log(this.props.user);
        // console.log(this.state.messageContent);
		var conversationList;
		if (this.state.existingConversationsList && this.state.currUser) {
			conversationList = this.state.existingConversationsList.map((conversation) => {
                console.log(conversation);
				return (
					<NewMessageThumbnail
						path={ '/Network/Messages/Conversation/:id' + conversation.id }
                        id={ conversation.id }
                        key={ conversation.id }
                        members = { conversation.members }
                        currUser = { this.state.currUser }
					/>
				);
			});
        }

		var displayExistingConversations = <div className="l-contacts">{ conversationList }</div>
        return (
			<div className="c-new-message">
                <HeaderBar
                    text={ 'New Message' }
                />
                <div className="c-new-message__search-wrapper">
                    <form className="[ form-inline ] c-new-message__search-form">
                        <input id="newMessageSearch" className="form-control mr-sm-2" type="search" placeholder="Search..." aria-label="Search" onChange={(e) => this.handleChange(e)}/>
                        <Button className="btn btn-outline-success my-2 my-sm-0 c-network-button" onClick={(e) => this.handleSearch(e)}>
                            <Glyphicon glyph="plus" /> 
                        </Button>
                    </form>
                </div>

				{ displayExistingConversations }
			</div>
        );
    }
}

export default withRouter(NewMessage);