/////////////////////////////////////////
/// Dev Notes

import React from 'react';
import { Link } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/ProgressNav.css';

/////////////////////////////////////////
/// Code
function ProgressNav(props) {
	var inProgressClassName;
	var completedClassName;
	if (props.navFilter == "inProgress") {
		inProgressClassName = "c-c-progress-nav__link c-progress-nav__link c-progress-nav__link--active-link";
		completedClassName = "c-c-progress-nav__link c-progress-nav__link c-progress-nav__link--non-active-link";
	} else {
		inProgressClassName = "c-c-progress-nav__link c-progress-nav__link c-progress-nav__link--non-active-link";
		completedClassName = "c-c-progress-nav__link c-progress-nav__link c-progress-nav__link--active-link";
	}

	return (
		<ul className="c-progress-nav">
			<li role="presentation" className={ inProgressClassName }>
				<Link to="#" className="" onClick={(e) => props.switchFilter(e, "inProgress")}>In Progress</Link>
			</li>
			<li role="presentation" className={ completedClassName }>
				<Link to="#" className="" onClick={(e) => props.switchFilter(e, "completed")}>Completed</Link>
			</li>
		</ul>
	);
}

export default ProgressNav;

// Junk land
				// <li role="presentation" className="c-progress-nav__link">
				// 	<Link to="/Progress/Category/3" className="" onClick={(e) => this.switchCategory(e, 3)}>Employment</Link>
				// </li>
				// <li role="presentation" className="c-progress-nav__link">
				// 	<Link to="/Progress/Category/4" className="" onClick={(e) => this.switchCategory(e, 4)}>Housing</Link>
				// </li>

				// class ProgressNav extends Component {
//     constructor(props) {
//         super(props);
    
//         this.state = {
// 			currentCategory: this.props.currentCategory,
// 			categories: {
// 				Category1: "Basic Needs",
// 				Category2: "Education",
// 				Category3: "Employment",
// 				Category4: "Housing"
// 			}
// 		};

// 		this.updateNav = this.updateNav.bind(this);
// 	}
	
	// componentDidMount() {
	// 	this.updateNav(this.props.targetCategory);
	// }

    // componentWillReceiveProps(nextProp) {
	// 	if (nextProp.targetCategory !== this.state.currentCategory) {
	// 		this.setState({
	// 			currentCategory: nextProp.targetCategory
	// 		});
	// 		this.updateNav(nextProp.targetCategory);
	// 	}
	// }
	
	// switchCategory(e, targetCategory) {
	// 	this.props.switchCategory(targetCategory);
	// }

    // render() {