/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components

/////////////////////////////////////////
/// Images & Styles
// import '../../css/progress/ProgressNav.css';

/////////////////////////////////////////
/// Code
class ParticipantNav extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
		};
		
    }

    componentDidMount() {
        var links = document.querySelectorAll(".c-network-nav a");
        if (this.props.location.pathname.includes("/resources")) {
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
            if (nextProp.location.pathname.includes("/resources")) {
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
					<Link to="/progress/people" className="" >PEOPLE</Link>
				</li>
				<li role="presentation" className="c-network-nav__link">
					<Link to="/progress/resources" className="" >RESOURCES</Link>
				</li>
			</ul>
        );
    }

}

export default withRouter(ParticipantNav);