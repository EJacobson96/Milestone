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
				<span className="" onClick={(e) => props.switchFilter(e, "inProgress")}>In Progress</span>
			</li>
			<li role="presentation" className={ completedClassName }>
				<span className="" onClick={(e) => props.switchFilter(e, "completed")}>Completed</span>
			</li>
		</ul>
	);
}

export default ProgressNav;
