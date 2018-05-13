/////////////////////////////////////////
/// Dev Notes

import React from 'react';

/////////////////////////////////////////
/// Standard Components
import ParticipantNav from './ParticipantNav';

/////////////////////////////////////////
/// Images & Styles
import '../../css/ParticipantHeading.css';
import ParticipantSearch from './ParticipantSearch';

/////////////////////////////////////////
/// Code

class ParticipantHeading extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: ''
		};
	}

	componentDidMount() {
	}

	componentWillReceiveProps() {

	}

	render() {
		return (
			<div>
				<div className='l-progress-content__head'>
					{/* <h1 className="c-progress-header">{ props.heading }</h1> */}
					<ParticipantNav 
						
					/>
					<ParticipantSearch 
						handleSearch={this.props.handleSearch}
					/>
						{/* contentType={this.state.contentType}
						handleSearch={(e) => this.handleSearch(e)} */}
				</div>
			</div>
		);
	}
}

export default ParticipantHeading;