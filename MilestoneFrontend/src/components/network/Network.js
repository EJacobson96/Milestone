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
            contactsContent: this.props.user.connections,
            networkRequests: this.props.user.pendingRequests,
            contentType: 'loading',
            search: '',
            showSearchAndNav: true,
            currUser: this.props.user,
        };
        
        this.handleSearch = this.handleSearch.bind(this);
        this.getMessages = this.getMessages.bind(this);
        this.getUserConnections = this.getUserConnections.bind(this);
    }
    
    componentDidMount() {
        this.getMessages('');
        this.getUserConnections('');
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
        if (this.state.contentType === 'contacts') {
            this.getUserConnections(search);
        } else {
            this.getMessages(search);
        }
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
                    contactsContent: data
                });
            })
            .catch(error => {
                console.log(error);
            }
        );
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
        return (
            <div className="l-network-content">
                <Switch>
                    <Route path='/Network/Messages/New' render={(props) => (
                        <NewMessage 
                            messageContent = { this.state.messageContent }                        
                        />
                    )} />
                    <Route exact path ='/Network/Messages/Conversation/:id' render={(props) => (
                        <MessageScreen />
                    )} />
                    <Route path="/Network/Messages" render={(props) => (
                        <div>
                            { topNav } 
                            <Messages currUser={ this.props.user.id } content={ this.state.messageContent } />
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
                            accountType={ this.props.user.accountType }
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
    }
}

export default withRouter(Network);