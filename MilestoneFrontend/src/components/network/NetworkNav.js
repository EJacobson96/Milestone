/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components

/////////////////////////////////////////
/// Images & Styles
import '../../css/NetworkNav.css';

/////////////////////////////////////////
/// Code

class NetworkNav extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
		};
		
        this.renderMessages = this.renderMessages.bind(this);
        this.renderContacts = this.renderContacts.bind(this);
    }
    
    renderMessages(e) {
        this.toggleLinks(e);
		
		this.props.renderMessages(e);
    }

    renderContacts(e) {
        this.toggleLinks(e);
		
		this.props.renderContacts(e);
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

    render() {
        return (
			<ul className="c-network-nav">
				<li role="presentation" className="c-network-nav__link">
					<Link to="/Network/Messages" className="c-network-nav__link--active-link" onClick={(e) => this.renderMessages(e)}>Messages</Link>
				</li>
				<li role="presentation" className="c-network-nav__link">
					<Link to="/Network/Contacts" className="c-network-nav__link--non-active-link" onClick={(e) => this.renderContacts(e)}>Contacts</Link>
				</li>
			</ul>
        );
    }
}

export default withRouter(NetworkNav);