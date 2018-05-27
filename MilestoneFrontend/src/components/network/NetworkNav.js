/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components

/////////////////////////////////////////
/// Images & Styles
import '../../css/network/NetworkNav.css';

/////////////////////////////////////////
/// Code

//handles switching between the people and messages nav elements
class NetworkNav extends Component {

    componentDidMount() {
        var links = document.querySelectorAll(".c-network-nav a");
        if (this.props.location.pathname.includes("/contacts")) {
            links[1].className = "c-network-nav__link--active-link";
            links[0].className = "c-network-nav__link--non-active-link";
        } else {
            links[0].className = "c-network-nav__link--active-link";
            links[1].className = "c-network-nav__link--non-active-link";
        }
    }

    componentWillReceiveProps(nextProp) {
        if (nextProp.location.pathname !== this.props.location.pathname) {
            var links = document.querySelectorAll(".c-network-nav a");
            if (nextProp.location.pathname.includes("/contacts")) {
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
					<Link to="/network/messages" onClick={(e) => this.props.renderMessages(e)}>Messages</Link>
				</li>
				<li role="presentation" className="c-network-nav__link">
					<Link to="/network/contacts" onClick={(e) => this.props.renderContacts(e)}>People</Link>
				</li>
			</ul>
        );
    }
}

export default withRouter(NetworkNav);