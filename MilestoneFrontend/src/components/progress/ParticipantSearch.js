/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { Glyphicon, Button } from 'react-bootstrap';  

/////////////////////////////////////////
/// Standard Components

/////////////////////////////////////////
/// Images & Styles
import '../../css/ParticipantHeading.css';

/////////////////////////////////////////
/// Code

class ParticipantSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: ''
		};
	}

    handleSearch(e) {
        e.preventDefault();
        let input = document.getElementById('networkSearch');
		let search = input.value;
		this.props.handleSearch(search);
		input.value = '';
    }

	render() {
		return (
			<div className="c-network-form">
				<form className="[ form-inline ] c-network-search">
					<input id="networkSearch" className="form-control mr-sm-2" type="search" placeholder="Search..." aria-label="Search"/>
					<Button className="btn btn-outline-success my-2 my-sm-0 c-network-button" onClick={(e) => this.handleSearch(e)}>
						<Glyphicon glyph="search" /> 
					</Button>
				</form>
			</div>
		);
	}
}

export default ParticipantSearch;