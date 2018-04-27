/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import Axios from 'axios';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import MediaQuery from 'react-responsive';

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
        this.getMessages = this.getMessages.bind(this);
        this.getUserConnections = this.getUserConnections.bind(this);
    }
    
    componentDidMount() {
        this.getCurrentUser();
    }

    componentWillReceiveProps() {
        this.getCurrentUser();
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
            this.getUserConnections(search);
        } else {
            this.getMessages(search);
        }
    }

    getCurrentUser() {
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
                this.setState({
                    currUser: data,
                    networkRequests: data.pendingRequests
                });
                this.getMessages('');
                this.getUserConnections('');
            })
            .catch(error => {
                console.log(error);
            }
        );
    }

    getMessages(search) {
        Axios.get(
            'https://milestoneapi.eric-jacobson.me/conversations?id=' + this.state.currUser.id + '&q=' + search,  
            {
                // headers: {
                //     'Authorization' : localStorage.getItem('Authorization')
                // }    
            })
            .then(response => {
                return response.data;
            })
            .then(data => {
                // console.log(data);
                this.setState({
                    messageContent: data,
                    contentType: 'messages'
                });
            })
            .catch(error => {
                console.log(error);
            }
        );
    }

    getUserConnections(search) {
        Axios.get(
            'https://milestoneapi.eric-jacobson.me/connections?q=' + search + "&id=" + this.state.currUser.id, 
            {
                headers: {
                    'Authorization' : localStorage.getItem('Authorization')
                }    
            })
            .then(response => {
                return response.data;
            })
            .then(data => {
                this.setState({
                    contactsContent: data
                });
            })
            .catch(error => {
                console.log(error);
            }
        );
    }

    render() {
        var topNav = <div className="topNav">
                        <NetworkNav
                            renderContacts={(e) => this.renderContacts(e)}
                            renderMessages={(e) => this.renderMessages(e)}
                        />
                        <NetworkSearch 
                            contentType={this.state.contentType}
                            handleSearch={(e) => this.handleSearch(e)}
                        />
                    </div>;
        var firstMessage;
            if (this.state.messageContent.length > 0) {
                firstMessage = this.state.messageContent[0];
            }
        if (this.state.currUser && this.state.messageContent) {
            return (
                <div className="l-network-content">
                    <Switch>
                        <Route path='/Network/Messages/New/Contacts' render={(props) => (
                            <ContactsList 
                                user = {this.state.currUser }                      
                            />
                        )} />
                        <Route path='/Network/Messages/New/' render={(props) => (
                            <NewMessage 
                                messageContent = { this.state.messageContent }  
                                user = {this.state.currUser }                      
                            />
                        )} />
                        <Route path ='/Network/Messages/Conversation/:id' render={(props) => (
                          <div>
                            <MediaQuery query="(max-device-width: 768px)">
                              <MessageScreen />
                            </MediaQuery>
                            <MediaQuery query="(min-device-width: 769px)">
                              <div className="container">
                                { topNav }
                                <div className="messageConversation">
                                    <Messages className="c-messages-component" currUser={ this.state.currUser.id } content={ this.state.messageContent } firstMessage = {firstMessage} />
                                    <MessageScreen className="c-messagescreen-component"/>
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
                            <MediaQuery query="(min-device-width: 769px)">
                                <Redirect to={"/Network/Messages/Conversation/:id" + firstMessage.id}  />      
                            </MediaQuery>
                          </div>
                        )} />
                        <Route exact path='/Network/Contacts/Request/:id' render={(props) => (
                            <NetworkRequestCard 
                                requests={ this.state.networkRequests }
                            />
                        )} />
                        <Route exact path ='/Network/Contacts/Profile/:id' render={(props) => (
                            <ContactCard />
                        )} />
                        <Route exact path="/Network/Contacts/Connect" render={(props) => (
                            <NetworkConnect 
                                accountType={ this.state.currUser.accountType }
                                currUser={ this.state.currUser }
                            />
                        )} />
                        <Route exact path="/Network/Contacts" render={(props) => (
                        <div>
                            { topNav }
                            <Contacts 
                                showRequests={ true } 
                                content={ this.state.contactsContent } 
                                currUser={ this.state.currUser }
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