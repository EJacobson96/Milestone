/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { FormControl, FormGroup, Glyphicon, Button } from 'react-bootstrap';

/////////////////////////////////////////
/// Standard Components

import NewMessageThumbnail from './NewMessageThumbnail';
import HeaderBar from '../ux/HeaderBar';

/////////////////////////////////////////
/// Images & Styles

import '../../css/network/NewMessage.css';

/////////////////////////////////////////
/// Code

//handles creating a new message thread
class NewMessage extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            connections: null,
            messageContent: [],
            currUser: this.props.user
        };
	}

    //when this component is mounted, renders message thread based off of query params
	componentDidMount() {
        var searchQuery = this.props.location.pathname;
        searchQuery = searchQuery.substring(22, searchQuery.length)
        this.appendToSearch(searchQuery);
        this.displayConversations(searchQuery);
        this.setState({
            connections: this.props.user.connections,
            messageContent: this.props.messageContent,
            searchQuery: searchQuery
        });
    }


    componentWillReceiveProps(nextProps) {
        var searchQuery = nextProps.location.pathname;
        searchQuery = searchQuery.substring(22, searchQuery.length)
        this.appendToSearch(searchQuery);
        this.displayConversations(searchQuery);
        this.setState({
            connections: nextProps.user.connections,
            messageContent: nextProps.messageContent,
            searchQuery: searchQuery
        })
    }

    //gets the user id's from the query params and finds the corresponding users,
    //then appends those users name to search input
    appendToSearch(search) {
        var input = document.getElementById('newMessageSearch');
        var searchQuery = search.trim().split(" ");
        var newSearchQuery = "";
        if (searchQuery.length > 0 && searchQuery[0]) {
            for (let i = 0; i < searchQuery.length; i++) {
                var userFullName;
                for (let j = 0; j < this.props.user.connections.length; j++) {
                    if (this.props.user.connections[j].id === searchQuery[i].trim()) {
                        userFullName = this.props.user.connections[j].fullName;
                    }
                }
                if (i === 0) {
                    newSearchQuery += userFullName;
                } else {
                    newSearchQuery += ", " + userFullName;
                }
            }
        }
        if (newSearchQuery) {
            input.value = newSearchQuery;
        }
        return newSearchQuery;
    }

    //checks to see if there are existing conversations with user's specified in the input,
    //otherwise creates a new message thread with user's specified in the input
    displayConversations(search) {
        var names = search.trim().split(" ");
        var filteredConversations = [];
        var conversations = this.props.messageContent;
        var existingConversation = false;
        var newMembers = [];
        if (names.length > 0 && names[0]) {
            for (let i = 0; i < conversations.length; i++) {
                for (let j = 0; j < names.length; j++) {
                    for (let k = 0; k < conversations[i].members.length; k++) {
                        if (conversations[i].members[k].id === names[j] && j === names.length - 1) {
                            if (names.length === conversations[i].members.length - 1) {
                                existingConversation = true;
                            }
                            filteredConversations.push(conversations[i]);
                            k = conversations[i].members.length;
                        } else if (conversations[i].members[k].id === names[j]) {
                            k = conversations[i].members.length;
                        } else if (k === conversations[i].members.length - 1) {
                            j = names.length;
                        }
                    }    
                }
            }
        }
        if (!existingConversation && names[0] !== "" && this.props.user.connections) {
            for (let i = 0; i < names.length; i++) {
                for (let j = 0; j < this.props.user.connections.length; j++) {
                    var connections = this.props.user.connections;
                    if (connections[j].id === names[i].trim() && names[i] !== "") {
                        var addConnection = {
                            id: connections[j].id,
                            fullName: connections[j].fullName
                        }
                        newMembers.push(addConnection);
                        j = connections.length;
                    } else if (j === connections.length - 1) {
                        newMembers = [];
                        i = names.length;
                    }
                }
            }
        }
        this.setState({
            existingConversationsList: filteredConversations,
            newConversation: newMembers,
        });
    }

    //handles creating a new conversation thread
    handleSubmit(e) {
        e.preventDefault();
        var users = this.state.newConversation;
        var filteredUsers = [];
        filteredUsers.push({
            ID: this.props.user.id,
            FullName: this.props.user.fullName
        })
        for (var i = 0; i < users.length; i++) {
            for (var j = i + 1; j < users.length; j++) {
                if (users[i].id === users[j].id) {
                    j = users.length;
                } else if (j === users.length - 1) {
                    filteredUsers.push({
                        ID: users[i].id,
                        FullName: users[i].fullName
                    });
                }
            }
            if (i === users.length - 1) {
                filteredUsers.push({
                    ID: users[i].id,
                    FullName: users[i].fullName
                });
            }
        }
        var message = this.textInput.value;
        if (this.state.newConversation && this.state.newConversation.length !== 0) {
            this.props.messageController.postConversation(this.props.user.id, message, filteredUsers)
                .then(data => {
                    this.props.history.push('/network/messages/conversation/:id' + data.id);
                })
        }
    }

    //clears all users from the search input
    clearInput(e) {
        e.preventDefault();
        var input = document.getElementById('newMessageSearch');
        input.value = "";
        this.setState({
            existingConversationsList: [],
            newConversation: [],
            searchQuery: "",
        }, () => {
            this.props.history.push('/network/messages/new/');
            this.props.location.pathname = '/network/messages/new/';
        });
    }

    render() {
        var conversationList;
        var newConversation;
		if (this.state.existingConversationsList && this.state.currUser) {
            if (this.state.newConversation && this.state.newConversation.length > 0) {
                newConversation = <NewMessageThumbnail
                                    currUser = { this.state.currUser }
                                    members = {this.state.newConversation }
                                    existing = { false }
                                  />
            }
			conversationList = this.state.existingConversationsList.map((conversation) => {
				return (
					<NewMessageThumbnail
						path={ '/network/messages/conversation/:id' + conversation.id }
                        id={ conversation.id }
                        key={ conversation.id }
                        members = { conversation.members }
                        currUser = { this.state.currUser }
                        existing = { true }
					/>
				);
            });
        }
		var displayExistingConversations = <div className="l-contacts">{newConversation}{conversationList}</div>
        return (
			<div className="c-new-message">
                <HeaderBar
                    text={ 'New Message' }
                />
                <div className="c-new-message__search-wrapper">
                    <form className="[ form-inline ] c-new-message__search-form">
                        <input id="newMessageSearch" className="form-control mr-sm-2" type="search" placeholder="Select a contact" aria-label="Search" onChange={(e) => this.handleChange(e)} disabled/>
                        <Button className="btn btn-outline-success my-2 my-sm-0 c-new-message-button" onClick={(e) => this.clearInput(e)}>Clear</Button>
                        <Link 
                            to={{
                        	    pathname: '/network/messages/new/contacts/' + this.state.searchQuery
                            }}
                            user={this.state.currUser}
                        > 
                            {
                                !this.props.isDesktop &&
                                <Button className="btn btn-outline-success my-2 my-sm-0 c-new-message-button">
                                    <Glyphicon glyph="plus" /> 
                                </Button>
                            }
                        </Link>
                    </form>
                </div>
                { displayExistingConversations }
                <FormGroup controlId="formControlsTextarea" className="c-messages-input-form">
                    <div className="input-group c-messages-input-group">
                        <FormControl inputRef={input => this.textInput = input} componentClass="input" placeholder="Message..." className="messageInput"/>
                        <span className="input-group-addon" id="basic-addon1">
                            <Glyphicon glyph="circle-arrow-right" onClick={(e) => this.handleSubmit(e)} />
                        </span>
                    </div>
                </FormGroup>
			</div>
        );
    }
}

export default withRouter(NewMessage);