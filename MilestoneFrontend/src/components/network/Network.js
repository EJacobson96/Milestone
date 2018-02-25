/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { Glyphicon, Button } from 'react-bootstrap';

/////////////////////////////////////////
/// Standard Components
import Contacts from './Contacts';
import Messages from './Messages';

/////////////////////////////////////////
/// Images & Styles
import '../../css/Network.css';

/////////////////////////////////////////
/// Code

class Network extends React.Component {
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

    handleSearch(e) {
        e.preventDefault();
        let input = document.getElementById('networkSearch');
        let search = input.value;
        if (this.state.contentType == 'contacts') {
            input.value = '';
            this.getUserConnections(search);
        } else {
            input.value = '';
            this.getMessages(search);
        }
    }

    toggleLinks(e) {
        var links = document.querySelectorAll(".c-network-nav a");
        for (let i = 0; i < links.length; i++) {
            links[i].className = "";
            if (links[i] == e.target) {
                links[i].className = "c-network-nav__link--active-link";
            } else {
                links[i].className = "c-network-nav__link--non-active-link";
            }
        }
    }

    getMessages(search) {
        Axios.get(
            'https://milestoneapi.eric-jacobson.me/conversations' + '?id=' + this.state.userID + '&q=' + search,  
            {
                // headers: {
                //     'Authorization' : localStorage.getItem('Authorization')
                // }    
            })
            .then(response => {
                return response.data;
            })
            .then(data => {
                console.log(data);
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
            'https://milestoneapi.eric-jacobson.me/connections' + '?q=' + search, 
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
                    content: data
                });
            })
            .catch(error => {
                console.log(error);
            }
        );
    }

    render() {
        var content = <Messages currUser={this.props.user.id} content={this.state.content} />
        if (this.state.contentType == 'contacts') {
            content = <Contacts content={this.state.content} />
        }
        return (
            <div>
                <ul className="c-network-nav">
                    <li role="presentation" className="c-network-nav__link">
                        <a href="#messages" className="c-network-nav__link--active-link" onClick={(e) => this.renderMessages(e)}>Messages</a>
                    </li>
                    <li role="presentation" className="c-network-nav__link">
                        <a href="#contacts" className="c-network-nav__link--non-active-link" onClick={(e) => this.renderContacts(e)}>Contacts</a>
                    </li>
                </ul>
                <div className="l-network-content">
                    <div className="">
                        <form className="form-inline">
                            <input id="networkSearch" className="form-control mr-sm-2" type="search" placeholder="Search..." aria-label="Search"/>
                            <Button className="btn btn-outline-success my-2 my-sm-0" onClick={(e) => this.handleSearch(e)}>
                                <Glyphicon glyph="search" /> 
                            </Button>
                            <Button className="btn btn-outline-success my-2 my-sm-0 plus">
                                <Glyphicon glyph="plus" /> 
                            </Button>
                        </form>
                    </div>
                    {content}
                </div>
            </div>
        );
    }
}

export default Network;