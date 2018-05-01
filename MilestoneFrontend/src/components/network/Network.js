/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import Axios from 'axios';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components
import NetworkNav from './NetworkNav';
import NetworkSearch from './NetworkSearch';
import Contacts from './Contacts';
import ContactCard from './ContactCard';
import NetworkRequestCard from './NetworkRequestCard';
import Messages from './Messages';
import NewMessage from './NewMessage';
import NetworkConnect from './NetworkConnect';
import MessageScreen from './MessageScreen';
import ContactsList from './ContactsList';

/////////////////////////////////////////
/// Images & Styles
import '../../css/Network.css';

import networkRequests from '../testdata/fakerequests.json';

/////////////////////////////////////////
/// Code

class Network extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageContent: [],
            contactsContent: [],
            networkRequests: [],
            contentType: 'loading',
            search: '',
            showSearchAndNav: true,
        };
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount() {
        this.setUserData();
    }

    componentWillReceiveProps() {
        this.setUserData();
    }

    setUserData() {
        this.props.userController.getUser()
            .then(data => {
                this.setState({
                    currUser: data,
                    networkRequests: data.pendingRequests
                });
                this.setMessageData('', data.id);
                this.setUserConnections('', data.id);
            })
    }

    setMessageData(search, id) {
        this.props.messageController.getMessages(search, id)
            .then(data => {
                this.setState({
                    messageContent: data,
                    contentType: 'messages'
                });
            })
    }

    setUserConnections(search, id) {
        this.props.userController.getUserConnections(search, id)
        .then(data => {
            this.setState({
                contactsContent: data
            });
        })
    }

    renderMessages(e) {
        this.setState({
            contentType: 'messages',
        })
    }

    renderContacts(e) {
        this.setState({
            contentType: 'contacts',
        })
    }

    handleSearch(search) {
        if (this.props.location.pathname.endsWith("/Contacts")) {
            this.setUserConnections(search, this.state.currUser.id);
        } else {
            this.setMessageData(search, this.state.currUser.id);
        }
    }

    render() {
        var topNav = <div>
            <NetworkNav
                renderContacts={(e) => this.renderContacts(e)}
                renderMessages={(e) => this.renderMessages(e)}
            />
            <NetworkSearch
                contentType={this.state.contentType}
                handleSearch={(e) => this.handleSearch(e)}
            />
        </div>;
        if (this.state.currUser && this.state.messageContent) {
            return (
                <div className="l-network-content">
                    <Switch>
                        <Route path='/Network/Messages/New/Contacts' render={(props) => (
                            <ContactsList
                                user={this.state.currUser}
                            />
                        )} />
                        <Route path='/Network/Messages/New/' render={(props) => (
                            <NewMessage
                                messageContent={this.state.messageContent}
                                user={this.state.currUser}
                            />
                        )} />
                        <Route exact path='/Network/Messages/Conversation/:id' render={(props) => (
                            <MessageScreen />
                        )} />
                        <Route path="/Network/Messages" render={(props) => (
                            <div>
                                {topNav}
                                <Messages currUser={this.state.currUser.id} content={this.state.messageContent} />
                            </div>
                        )} />
                        <Route exact path='/Network/Contacts/Request/:id' render={(props) => (
                            <NetworkRequestCard
                                requests={this.state.networkRequests}
                            />
                        )} />
                        <Route exact path='/Network/Contacts/Profile/:id' render={(props) => (
                            <ContactCard />
                        )} />
                        <Route exact path="/Network/Contacts/Connect" render={(props) => (
                            <NetworkConnect
                                accountType={this.state.currUser.accountType}
                                currUser={this.state.currUser}
                            />
                        )} />
                        <Route exact path="/Network/Contacts" render={(props) => (
                            <div>
                                {topNav}
                                <Contacts
                                    showRequests={true}
                                    content={this.state.contactsContent}
                                    currUser={this.state.currUser}
                                />
                            </div>
                        )} />
                        <Route exact path="/Network" render={(props) => (
                            <Redirect to="/Network/Messages" />
                        )} />
                    </Switch>
                </div>
            );
        } else {
            return <p></p>
        }
    }
}

export default withRouter(Network);