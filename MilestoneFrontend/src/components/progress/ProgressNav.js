/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components

/////////////////////////////////////////
/// Images & Styles
import '../../css/ProgressNav.css';

/////////////////////////////////////////
/// Code

class ProgressNav extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
			currentCategory: this.props.currentCategory,
			categories: {
				Category1: "Basic Needs",
				Category2: "Education",
				Category3: "Employment",
				Category4: "Housing"
			}
		};

		this.updateNav = this.updateNav.bind(this);
	}
	
	componentDidMount() {
		this.updateNav(this.props.targetCategory);
	}

    componentWillReceiveProps(nextProp) {
		if (nextProp.targetCategory !== this.state.currentCategory) {
			this.setState({
				currentCategory: nextProp.targetCategory
			});
			this.updateNav(nextProp.targetCategory);
		}
	}

	updateNav(targetCategory) {
		let links = document.querySelectorAll('.c-progress-nav a');
		for (let i = 0; i < links.length; i++) {
			if (links[i].getAttribute('href').endsWith(targetCategory)) {
				links[i].className = "c-progress-nav__link c-progress-nav__link--active-link";
			}
			else {
				links[i].className = "c-progress-nav__link c-progress-nav__link--non-active-link";
			}
		}
	}
	
	switchCategory(e, targetCategory) {
		this.props.switchCategory(targetCategory);
	}

    render() {
        return (
			<ul className="c-progress-nav">
				<li role="presentation" className="c-progress-nav__link">
					<Link to="/Progress/Category/1" className="" onClick={(e) => this.switchCategory(e, 1)}>Basic Needs</Link>
				</li>
				<li role="presentation" className="c-progress-nav__link">
					<Link to="/Progress/Category/2" className="" onClick={(e) => this.switchCategory(e, 2)}>Education</Link>
				</li>
				<li role="presentation" className="c-progress-nav__link">
					<Link to="/Progress/Category/3" className="" onClick={(e) => this.switchCategory(e, 3)}>Employment</Link>
				</li>
				<li role="presentation" className="c-progress-nav__link">
					<Link to="/Progress/Category/4" className="" onClick={(e) => this.switchCategory(e, 4)}>Housing</Link>
				</li>
			</ul>
        );
    }
}

export default withRouter(ProgressNav);