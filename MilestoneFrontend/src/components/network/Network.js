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
            userID: this.props.user.id,
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.getMessages = this.getMessages.bind(this);
    }
    
    componentDidMount() {
        this.getMessages('');          
    }

    renderMessages(e) {
        this.toggleLinks(e);
        this.setState({
            contentType: 'messages',
            content: this.getMessages('')
        })
    }

    renderContacts(e) {
        this.toggleLinks(e);
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

    toggleLinks(e) {
        var links = document.querySelectorAll(".c-network-nav a");
        for (let i = 0; i < links.length; i++) {
            links[i].className = "";
            if (links[i] === e.target) {
                links[i].className = "c-network-nav__link--active-link";
            } else {
                links[i].className = "c-network-nav__link--non-active-link";
            }
        }
    }

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
        return (
            <div>
                <NetworkNav
                    renderContacts={(e) => this.renderContacts(e)}
                    renderMessages={(e) => this.renderMessages(e)}
                />
                <div className="l-network-content">
                    <NetworkSearch 
                        handleSearch={(e) => this.handleSearch(e)}
                    />
                    <Switch>
                        <Route path="/Network/Messages" render={(props) => (
                            <Messages currUser={this.props.user.id} content={this.state.content} />
                        )} />
                        <Route exact path ='/Network/Contacts/:id' component={ContactCard} />
                        <Route path="/Network/Contacts" render={(props) => (
                            <Contacts content={this.state.content} />
                        )} />
                        <Route exact path="/Network" render={(props) => (
                            <Redirect to="/Network/Messages" />
                        )} />
                    </Switch>
                </div>
            </div>
        );
    }
}

export default withRouter(Network);