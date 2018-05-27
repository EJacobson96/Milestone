/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import MediaQuery from 'react-responsive';

/////////////////////////////////////////
/// Standard Components
import NetworkNav from './NetworkNav';
import NetworkSearch from './NetworkSearch';
import Contacts from './Contacts';
import ContactCard from './ContactCard';
import Messages from './Messages';
import NewMessage from './NewMessage';
import NetworkConnect from './NetworkConnect';
import MessageScreen from './MessageScreen';
import ContactsList from './ContactsList';

/////////////////////////////////////////
/// Images & Styles
import '../../css/Network.css';

/////////////////////////////////////////
/// Code
const websocket = new WebSocket("wss://api.milestoneapp.org/ws");

class Network extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageContent: [],
            contactsContent: [],
            search: '',
        };
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount() {
        this.setUserData();
        websocket.addEventListener("message", function(event) { 
            var data = JSON.parse(event.data);
            if (this.state.currUser && data.payload.id == this.state.currUser.id) {
                this.setUserData();
            }
        }.bind(this));  
    }

    setUserData() {
        this.props.userController.getUser()
            .then(data => {
                console.log(data);
                this.setState({
                    currUser: data,
                }, () => {
                    //bugs out when session ends but bearer token still remains
                    this.setMessageData('', data.id);
                    this.setUserConnections('', data.id);
                })
            })
    }

    setMessageData(search, id) {
        if (id) {
            this.props.messageController.getMessages(search, id)
            .then(data => {
                this.setState({
                    messageContent: data,
                }, () => {
                    if (this.props.location.pathname === "/Network/Messages/Conversation/:id" && data[0]) {
                        this.props.history.push("/Network/Messages/Conversation/:id" + data[0].id)
                    }
                });
            })
        }
    }

    setUserConnections(search, id) {
        this.props.userController.getUserConnections(search, id)
            .then(data => {
                this.setState({
                    contactsContent: data
                });
            })
    }

    //re-renders all messages when switching between nav elements
    renderMessages(e) {
        this.handleSearch("");
    }

    //re-renders all contacts when switching between nav elements
    renderContacts(e) {
        this.handleSearch("");
    }

    handleSearch(search) {
        if (this.props.location.pathname.includes("/contacts")) {
            this.props.userController.getUserConnections(search, this.state.currUser.id)
            .then(data => {
                this.setState({
                    contactsContent: data
                });
            })
        } else {
            this.setMessageData(search, this.state.currUser.id);
        }
    }

    render() {
        var topNav = <div className="topNav">
            <NetworkNav className="networkNav"
                renderContacts={(e) => this.renderContacts(e)}
                renderMessages={(e) => this.renderMessages(e)}
            />
            <NetworkSearch className="networkSearch"
                handleSearch={(e) => this.handleSearch(e)}
            />
        </div>;
        var firstMessage = [];
        if (this.state.currUser && this.state.messageContent) {
            return (
                <div className="l-network-content">
                    <Switch>
                        <Route path='/network/messages/new/contacts' render={(props) => (
                            <ContactsList
                                user={this.state.currUser}
                                userController={this.props.userController}
                                contacts= { this.state.contactsContent }
                            />
                        )} />
                        <Route path='/network/messages/new/' render={(props) => (
                            <div>
                                <MediaQuery query="(max-width: 768px)">
                                    <NewMessage
                                        messageContent={this.state.messageContent}
                                        user={this.state.currUser}
                                        userController={this.props.userController}
                                        messageController={this.props.messageController}
                                    />
                                </MediaQuery>
                                <MediaQuery query="(min-width: 769px)">
                                    <div className="container">
                                        <div className="contactsNewMessage">
                                            <ContactsList
                                                user={this.state.currUser}
                                                userController={this.props.userController}
                                                contacts= { this.state.contactsContent }
                                            />
                                            <NewMessage
                                                isDesktop={true}
                                                messageContent={this.state.messageContent}
                                                user={this.state.currUser}
                                                userController={this.props.userController}
                                                messageController={this.props.messageController}
                                            />
                                        </div>
                                    </div>
                                </MediaQuery>
                            </div>
                        )} />
                        <Route path='/network/messages/conversation/:id' render={(props) => (
                            <div>
                                <MediaQuery query="(max-device-width: 768px)">
                                    <MessageScreen
                                        userController={this.props.userController}
                                        messageController={this.props.messageController}
                                    />
                                </MediaQuery>
                                <MediaQuery query="(min-width: 769px)">
                                    <div className="container">
                                        <NetworkNav className="networkNav"
                                            renderContacts={(e) => this.renderContacts(e)}
                                            renderMessages={(e) => this.renderMessages(e)}
                                        />
                                        <div className="messageConversation">
                                            <Messages className="c-messages-component" 
                                                currUser={this.state.currUser} 
                                                content={this.state.messageContent} 
                                                firstMessage={firstMessage} 
                                                renderSearch={ true }
                                                handleSearch={(e) => this.handleSearch(e)}
                                            />
                                            <MessageScreen className="c-messagescreen-component"
                                                userController={this.props.userController}
                                                messageController={this.props.messageController}
                                            />
                                        </div>
                                    </div>
                                </MediaQuery>
                            </div>
                        )} />
                        <Route exact path="/network/messages" render={(props) => (
                            <div>
                                <MediaQuery query="(max-width: 768px)">
                                    <div>
                                        {topNav}
                                        <Messages currUser={this.state.currUser} content={this.state.messageContent} />
                                    </div>
                                </MediaQuery>
                                <MediaQuery query="(min-width: 769px)">
                                    <Redirect to={"/network/messages/conversation/:id" + (this.state.messageContent.length > 0 ? this.state.messageContent[0].id : '')} />
                                </MediaQuery>
                            </div>
                        )} />
                        <Route exact path='/network/contacts/profile/:id' render={(props) => (
                            <div>
                                <MediaQuery query="(max-width: 768px)">
                                    <ContactCard
                                        messageContent={this.state.messageContent}
                                        userController={this.props.userController}
                                    />
                                </MediaQuery>
                                <MediaQuery query="(min-width: 769px)">
                                    <div className="container">
                                        <NetworkNav className="networkNav"
                                            renderContacts={(e) => this.renderContacts(e)}
                                            renderMessages={(e) => this.renderMessages(e)}
                                        />
                                        <div className="desktopContacts">
                                            <Contacts
                                                showRequests={true}
                                                content={this.state.contactsContent}
                                                currUser={this.state.currUser}
                                                userController={this.props.userController}
                                                renderSearch={ true }
                                                handleSearch={(e) => this.handleSearch(e)}
                                            />
                                            <ContactCard
                                                messageContent={this.state.messageContent}
                                                userController={this.props.userController}
                                            />
                                        </div>
                                    </div>
                                </MediaQuery>

                            </div>

                        )} />
                        <Route exact path="/network/contacts/connect" render={(props) => (
                            <div>
                                <MediaQuery query="(max-width: 768px)">
                                    <NetworkConnect
                                        isDesktop={false}
                                        accountType={this.state.currUser.accountType}
                                        currUser={this.state.currUser}
                                        userController={this.props.userController}
                                    />
                                </MediaQuery>
                                <MediaQuery query="(min-width: 769px)">
                                    <Redirect to='/network/contacts/connect/profile/:id' />
                                </MediaQuery>
                            </div>
                        )} />
                        <Route exact path='/network/contacts/connect/profile/:id' render={(props) => (
                            <div>
                                <MediaQuery query="(max-width: 768px)">
                                    <Redirect to="/network/contacts/connect" />
                                </MediaQuery>
                                <MediaQuery query="(min-width: 769px)">
                                    <div className="container">
                                        <div className="connectContacts">
                                            <NetworkConnect
                                                isDesktopInvitation={true}
                                                accountType={this.state.currUser.accountType}
                                                currUser={this.state.currUser}
                                                userController={this.props.userController}
                                            />
                                            <ContactCard
                                                messageContent={this.state.messageContent}
                                                userController={this.props.userController}
                                            />
                                        </div>
                                    </div>
                                </MediaQuery>
                            </div>
                        )} />
                        <Route exact path="/network/contacts" render={(props) => (
                            <div>
                                <MediaQuery query="(max-width: 768px)">
                                    <div>
                                        {topNav}
                                        <Contacts
                                            showRequests={true}
                                            content={this.state.contactsContent}
                                            currUser={this.state.currUser}
                                            userController={this.props.userController}
                                        />
                                    </div>
                                </MediaQuery>
                                <MediaQuery query="(min-width: 769px)">
                                    <Redirect to={"/network/contacts/profile/:id"} />
                                </MediaQuery>
                            </div>
                        )} />
                        <Route exact path="/network" render={(props) => (
                            <Redirect to="/network/messages" />
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