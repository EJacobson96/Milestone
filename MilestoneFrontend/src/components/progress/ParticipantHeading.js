/////////////////////////////////////////
/// Dev Notes

import React from 'react';

/////////////////////////////////////////
/// Standard Components
import ParticipantNav from './ParticipantNav';

/////////////////////////////////////////
/// Images & Styles
import '../../css/ParticipantHeading.css';
import NetworkSearch from '../network/NetworkSearch';

/////////////////////////////////////////
/// Code

function ParticipantHeading (props) {
	return (
		<div>
			<div className='l-progress-content__head'>
				<h1 className="c-progress-header">{ props.heading }</h1>
				<ParticipantNav/>
				<NetworkSearch
					// handleSearch={ (e) => props.handleSearch(e) }
					// addBtnLink={ props.addBtnLink }
				/>
			</div>
		</div>
	)
}

export default ParticipantHeading;