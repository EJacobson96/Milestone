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
import Messages from './Messages';
import NetworkConnect from './NetworkConnect';

/////////////////////////////////////////
/// Images & Styles
import '../../css/Network.css';

/////////////////////////////////////////
/// Code

class Network extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            contentType: 'messages',
            search: '',
            showSearchAndNav: true,
            userID: this.props.user.id,
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.getMessages = this.getMessages.bind(this);
    }
    
    componentDidMount() {
        this.getMessages('');          
    }

    renderMessages(e) {
        this.setState({
            contentType: 'messages',
            content: this.getMessages('')
        })
    }

    renderContacts(e) {
        this.setState({
            contentType: 'contacts',
            content: this.getUserConnections('')
        })
    }

    handleSearch(search) {
        if (this.state.contentType === 'contacts') {
            this.getUserConnections(search);
        } else {
            this.getMessages(search);
        }
    }

    // toggleSearchAndNav(e) {
    //     let toggle = !this.state.showSearchAndNav;
    //     this.setState({
    //         showSearchAndNav: toggle
    //     })
    // }

    getMessages(search) {
        Axios.get(
            'https://milestoneapi.eric-jacobson.me/conversations?id=' + this.state.userID + '&q=' + search,  
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
                    content: data
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
                // console.log(data);
                this.setState({
                    content: data
                });
            })
            .catch(error => {
                console.log(error);
            }
        );
    }

    render() {
        console.log("here");
        var topNav = <div>
                        <NetworkNav
                            renderContacts={(e) => this.renderContacts(e)}
                            renderMessages={(e) => this.renderMessages(e)}
                        />
                        <NetworkSearch 
                            handleSearch={(e) => this.handleSearch(e)}
                        />
                    </div>;
        return (
            <div className="l-network-content">
                <Switch>
                    <Route path="/Network/Messages" render={(props) => (
                        <div>
                            {topNav} 
                            <Messages currUser={this.props.user.id} content={this.state.content} />
                        </div>
                    )} />
                    <Route exact path ='/Network/Contacts/Profile/:id' render={(props) => (
                        <ContactCard />
                    )} />
                    <Route exact path="/Network/Contacts/Connect" render={(props) => (
                        <NetworkConnect />
                    )} />
                    <Route exact path="/Network/Contacts" render={(props) => (
                    <div>
                        {topNav}
                        <Contacts content={this.state.content} />
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