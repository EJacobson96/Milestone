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

const ProgressHeading = (props) => {
	return (
		<div>
			<div className='l-progress-content__head'>
				<ProgressSearch
					handleSearch={ (e) => props.handleSearch(e) }
					addBtnLink={ props.addBtnLink }
				/>
				<h1 className="c-progress-header">{ props.heading }</h1>
				<ProgressNav
					navFilter={ props.navFilter }
					switchFilter={ (e, t) => props.switchFilter(e, t) }
				/>
			</div>
		</div>
	)
}

export default ProgressHeading;