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
		this.props.renderMessages(e);
    }

    renderContacts(e) {
		this.props.renderContacts(e);
    }

    componentDidMount() {
        var links = document.querySelectorAll(".c-network-nav a");
        if (this.props.location.pathname.endsWith("/Contacts")) {
            links[1].className = "c-network-nav__link--active-link";
            links[0].className = "c-network-nav__link--non-active-link";
        } else {
            links[0].className = "c-network-nav__link--active-link";
            links[1].className = "c-network-nav__link--non-active-link";
        }
    }

    componentWillReceiveProps(nextProp) {
        if (nextProp.location.pathname != this.props.location.pathname) {
            var links = document.querySelectorAll(".c-network-nav a");
            if (nextProp.location.pathname.endsWith("/Contacts")) {
                links[1].className = "c-network-nav__link--active-link";
                links[0].className = "c-network-nav__link--non-active-link";
            } else {
                links[0].className = "c-network-nav__link--active-link";
                links[1].className = "c-network-nav__link--non-active-link";
            }
        }
    }

    render() {
        return (
			<ul className="c-network-nav">
				<li role="presentation" className="c-network-nav__link">
					<Link to="/Network/Messages" className="" onClick={(e) => this.renderMessages(e)}>Messages</Link>
				</li>
				<li role="presentation" className="c-network-nav__link">
					<Link to="/Network/Contacts" className="" onClick={(e) => this.renderContacts(e)}>People</Link>
				</li>
			</ul>
        );
    }
}

export default withRouter(NetworkNav);