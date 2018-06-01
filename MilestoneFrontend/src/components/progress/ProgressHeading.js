/////////////////////////////////////////
/// Dev Notes

import React from 'react';

/////////////////////////////////////////
/// Standard Components
import ProgressSearch from './ProgressSearch';
import ProgressNav from './ProgressNav';

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/Progress.css';

/////////////////////////////////////////
/// Code

// A container component for managing and displaying a heading for several sections of
// Milestone's 'Progress' feature. Displays a heading, as well as a tabbed navigation bar
// via ProgressNav and a multipurpose search component via ProgressSearch.
const ProgressHeading = (props) => {
	return (
		<div>
			<div className='l-progress-content__head'>
				<ProgressSearch
					handleSearch={ (e) => props.handleSearch(e) }
					addBtnLink={ props.addBtnLink }
				/>
				<div>
					<h1 className="c-progress-header">{ props.heading }</h1>
					<ProgressNav
						navFilter={ props.navFilter }
						switchFilter={ (e, t) => props.switchFilter(e, t) }
					/>
				</div>
			</div>
		</div>
	)
}

export default ProgressHeading;