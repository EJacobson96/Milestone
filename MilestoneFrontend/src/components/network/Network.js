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

class Network extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageContent: [],
            contactsContent: [],
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
        if (this.props.location.pathname.includes("/Contacts")) {
            this.getUserConnections(search);
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
                            contentType={this.state.contentType}
                            handleSearch={(e) => this.handleSearch(e)}
                        />
                    </div>;
        var firstMessage = [];
        if (this.state.currUser && this.state.messageContent) {
            return (
                <div className="l-network-content">
                    <Switch>
                        <Route path='/Network/Messages/New/Contacts' render={(props) => (
                            <ContactsList
                                user={this.state.currUser}
                                userController = { this.props.userController }
                            />
                        )} />
                        <Route path='/Network/Messages/New/' render={(props) => (
                            <div>
                                <MediaQuery query="(max-width: 768px)">
                                    <NewMessage 
                                        messageContent = { this.state.messageContent }  
                                        user = {this.state.currUser }   
                                userController = { this.props.userController }
                                messageController = { this.props.messageController }
                                    />
                                </MediaQuery>
                                <MediaQuery query="(min-width: 769px)">
                                    <div className="container">
                                        <div className="contactsNewMessage">
                                            <ContactsList 
                                                user = {this.state.currUser }                      
                                            />
                                            <NewMessage 
                                                isDesktop= { true }
                                                messageContent = { this.state.messageContent }  
                                                user = {this.state.currUser }   
                                userController = { this.props.userController }
                                messageController = { this.props.messageController }
                                            />
                                        </div>
                                    </div>
                                </MediaQuery>
                            </div>
                        )} />
                        <Route path ='/Network/Messages/Conversation/:id' render={(props) => (
                          <div>
                            <MediaQuery query="(max-device-width: 768px)">
                              <MessageScreen 
                                                                                  userController = { this.props.userController }
                                messageController = { this.props.messageController }
                                                                                  />
                            </MediaQuery>
                            <MediaQuery query="(min-width: 769px)">
                              <div className="container">
                                { topNav }
                                <div className="messageConversation">
                                    <Messages className="c-messages-component" currUser={ this.state.currUser.id } content={ this.state.messageContent } firstMessage = {firstMessage} />
                                    <MessageScreen className="c-messagescreen-component"
userController = { this.props.userController }
                                messageController = { this.props.messageController }
/>
                                </div>
                              </div>
                            </MediaQuery>
                          </div>
                        )} />
                        <Route exact path="/Network/Messages" render={(props) => (
                          <div>
                              {console.log(window.innerWidth)}
                            <MediaQuery query="(max-width: 768px)">
                                <div>
                                    { topNav } 
                                    <Messages currUser={ this.state.currUser.id } content={ this.state.messageContent } />
                                </div>
                            </MediaQuery>
                            <MediaQuery query="(min-width: 769px)">
                                <Redirect to={"/Network/Messages/Conversation/:id" + (this.state.messageContent.length > 0 ? this.state.messageContent[0].id : '')}  />      
                            </MediaQuery>
                          </div>
                        )} />
                        <Route exact path ='/Network/Contacts/Profile/:id' render={(props) => (
                            <div>
                                <MediaQuery query="(max-width: 768px)">
                                    <ContactCard 
                                                                                   userController = { this.props.userController }
                                                                                   />
                                </MediaQuery>
                                <MediaQuery query="(min-width: 769px)">
                                    <div className="container">
                                        { topNav }
                                        <div className="desktopContacts">
                                            <Contacts 
                                                showRequests={ true } 
                                                content={ this.state.contactsContent } 
                                                currUser={ this.state.currUser }
userController = { this.props.userController }
                                            />
                                            <ContactCard 
userController = { this.props.userController }
/>
                                        </div>
                                    </div>
                                </MediaQuery>

                            </div>

                        )} />
                        <Route exact path="/Network/Contacts/Connect" render={(props) => (
                            <div>
                                <MediaQuery query="(max-width: 768px)">
                                        <NetworkConnect 
                                            isDesktop={ false }
                                            accountType={ this.state.currUser.accountType }
                                            currUser={ this.state.currUser }
userController = { this.props.userController }
                                        />
                                </MediaQuery>
                                <MediaQuery query="(min-width: 769px)">
                                    <Redirect to='/Network/Contacts/Connect/Profile/:id' />
                                </MediaQuery>
                            </div>
                        )} />
                        <Route exact path ='/Network/Contacts/Connect/Profile/:id' render={(props) => (
                            <div>
                                <MediaQuery query="(max-width: 768px)">
                                    <Redirect to="/Network/Contacts/Connect" />
                                </MediaQuery>
                                <MediaQuery query="(min-width: 769px)">
                                    <div className="container">
                                        <div className="connectContacts">
                                            <NetworkConnect 
                                                isDesktopInvitation={ true }
                                                accountType={ this.state.currUser.accountType }
                                                currUser={ this.state.currUser }
userController = { this.props.userController }
                                            />
                                            <ContactCard 
userController = { this.props.userController }
/>
                                        </div>
                                    </div>
                                </MediaQuery>
                            </div>
                        )} />
                        <Route exact path="/Network/Contacts" render={(props) => (
                            <div>
                                <MediaQuery query="(max-width: 768px)">
                                    <div>
                                        { topNav }
                                        <Contacts 
                                            showRequests={ true } 
                                            content={ this.state.contactsContent } 
                                            currUser={ this.state.currUser }
userController = { this.props.userController }
                                        />
                                    </div>
                                </MediaQuery>
                                <MediaQuery query="(min-width: 769px)">
                                    <Redirect to={"/Network/Contacts/Profile/:id"} />
                                </MediaQuery>
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