/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import Axios from 'axios';
import { withRouter, Link } from 'react-router-dom';
import { Glyphicon, Button } from 'react-bootstrap';

/////////////////////////////////////////
/// Standard Components

import ContactsList from './ContactsList';
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

        this.handleSearch = this.handleSearch.bind(this);
	}

	componentDidMount() {
        var searchQuery = this.props.location.pathname;
        console.log(searchQuery);
        searchQuery = searchQuery.substring(22, searchQuery.length)
        this.appendToSearch(searchQuery);
        this.setState({
            connections: this.props.user.connections,
            messageContent: this.props.messageContent,
            searchQuery: searchQuery
        });
    }

    componentWillReceiveProps() {
    }
    
    appendToSearch(search) {
        var input = document.getElementById('newMessageSearch');
        var searchQuery = search.trim().split(" ");
        var newSearchQuery = "";
        if (searchQuery.length > 1) {
            for (let i = 0; i < searchQuery.length; i += 2) {
                if (i == 0) {
                    newSearchQuery += searchQuery[i] + " " + searchQuery[i + 1];
                } else {
                    newSearchQuery += ", " + searchQuery[i] + " " + searchQuery[i + 1];
                }
            }
        }
        if (newSearchQuery) {
            input.value = newSearchQuery;
        }
    }

    renderConversations(messages) {

    }

    handleSearch(e) {
        e.preventDefault();
        let input = document.getElementById('newMessageSearch');
		let search = input.value;
        this.getUserConnections(search);
    }

    handleChange(e) {
        // e.preventDefault();
        // var input = e.target.value;
        // var names = input.replace(/\s+/g, '').split(",");
        // var filteredConversations = [];
        // var conversations = this.state.messageContent;
        // var existingConversation = false;
        // var newMembers = [];
        // if (input != "") {
        //     for (var i = 0; i < conversations.length; i++) {
        //         for (var j = 0; j < names.length; j++) {
        //             for (var k = 0; k < conversations[i].members.length; k++) {
        //                 if (conversations[i].members[k].fullName.toLowerCase().includes(names[j].toLowerCase()) && j == names.length - 1) {
        //                     if (names.length === conversations[i].members.length - 1) {
        //                         existingConversation = true;
        //                     }
        //                     console.log(conversations[i].members[k]);
        //                     filteredConversations.push(conversations[i]);
        //                     k = conversations[i].members.length;
        //                 } else if (k == conversations[i].members.length - 1) {
        //                     j = names.length;
        //                 }
        //             }
        //         }
        //     }
        // }
        // if (!existingConversation && names[0] != "") {
        //     for (var i = 0; i < names.length; i++) {
        //         for (var j = 0; j < this.state.currUser.connections.length; j++) {
        //             var connections = this.state.currUser.connections;
        //             if (connections[j].FullName.toLowerCase().includes(names[i].toLowerCase()) && names[i] !== "") {
        //                 var addConnection = {
        //                     id: connections[j].id,
        //                     fullName: connections[j].FullName
        //                 }
        //                 console.log(addConnection);
        //                 newMembers.push(addConnection);
        //                 j = connections.length;
        //             } else if (j == connections.length - 1) {
        //                 newMembers = [];
        //                 i = names.length;
        //             }
        //         }
        //     }
        // }
        // console.log(newMembers.length);
        // this.setState({
        //     existingConversationsList: filteredConversations,
        //     newConversation: newMembers,
        // });
    }

    render() {
        var conversationList;
        var newConversation;
		if (this.state.existingConversationsList && this.state.currUser) {
            if (this.state.newConversation && this.state.newConversation[0] != "") {
                newConversation = <NewMessageThumbnail
                                    currUser = { this.state.currUser }
                                    members = {this.state.newConversation }
                                  />
            }
			conversationList = this.state.existingConversationsList.map((conversation) => {
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

		var displayExistingConversations = <div className="l-contacts">{newConversation}{ conversationList }</div>
        return (
			<div className="c-new-message">
                <HeaderBar
                    text={ 'New Message' }
                />
                <div className="c-new-message__search-wrapper">
                    <form className="[ form-inline ] c-new-message__search-form">
                        <input id="newMessageSearch" className="form-control mr-sm-2" type="search" placeholder="Search..." aria-label="Search" onChange={(e) => this.handleChange(e)}/>
                        <Link 
                            to={{
                        	    pathname: '/Network/Messages/New/Contacts/' + this.state.searchQuery
                            }}
                            user={this.state.currUser}
                        >
                            <Button className="btn btn-outline-success my-2 my-sm-0 c-new-message-button">
                                <Glyphicon glyph="plus" /> 
                            </Button>
                        </Link>
                    </form>
                </div>

				{ displayExistingConversations }
			</div>
        );
    }
}

export default withRouter(NewMessage);