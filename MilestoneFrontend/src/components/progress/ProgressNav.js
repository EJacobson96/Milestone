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

// A stateless component for displaying a reusable tabbed navigation bar for the Goals and
// UpcomingTasks component. Accepts a currently selected filter prop ('inProgress' or 'completed'),
// as well as a function for switching that filter as a prop.
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
				<span className="" onClick={(e) => props.switchFilter(e, "inProgress")}>In Progress</span>
			</li>
			<li role="presentation" className={ completedClassName }>
				<span className="" onClick={(e) => props.switchFilter(e, "completed")}>Completed</span>
			</li>
		</ul>
	);
}

export default ProgressNav;
