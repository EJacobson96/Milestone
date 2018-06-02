/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components

/////////////////////////////////////////
/// Images & Styles
import '../../css/ParticipantNav.css';

/////////////////////////////////////////
/// Code

// A component for displaying a tabbed navigation bar for logged in service providers.
// Offers two tabs: a list of connected participants, and a list of resources to be
// managed by the service provider.
class ParticipantNav extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
		};
		
    }

    componentDidMount() {
        var links = document.querySelectorAll(".c-participant-nav a");
        if (this.props.location.pathname.includes("/resources")) {
            links[1].className = "c-participant-nav__link--active-link";
            links[0].className = "c-participant-nav__link--non-active-link";
        } else {
            links[0].className = "c-participant-nav__link--active-link";
            links[1].className = "c-participant-nav__link--non-active-link";
        }
    }

    componentWillReceiveProps(nextProp) {
        if (nextProp.location.pathname !== this.props.location.pathname) {
            var links = document.querySelectorAll(".c-participant-nav a");
            if (nextProp.location.pathname.includes("/resources")) {
                links[1].className = "c-participant-nav__link--active-link";
                links[0].className = "c-participant-nav__link--non-active-link";
            } else {
                links[0].className = "c-participant-nav__link--active-link";
                links[1].className = "c-participant-nav__link--non-active-link";
            }
        }
    }
    render() {
        return (
			<ul className="c-participant-nav">
				<li role="presentation" className="c-participant-nav__link">
					<Link to="/progress/provider/participants" className="" >PEOPLE</Link>
				</li>
				<li role="presentation" className="c-participant-nav__link">
					<Link to="/progress/resources" className="" >RESOURCES</Link>
				</li>
			</ul>
        );
    }

}

export default withRouter(ParticipantNav);