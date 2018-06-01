/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { Glyphicon, Button } from 'react-bootstrap';  

/////////////////////////////////////////
/// Standard Components

/////////////////////////////////////////
/// Images & Styles
import '../../css/ParticipantSearch.css';

/////////////////////////////////////////
/// Code

// A component for searching through connected participants as a logged in service
// provider. 
class ParticipantSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: ''
		};
	}

	// Handles the initiation of a search by the user. Retrieves the current search
	// query, clears the search input and passes the query upwards to the appropriate controller.
    handleSearch(e) {
		if (e) {
			e.preventDefault();
		}
        let input = document.getElementById('participantSearch');
		let search = input.value;
		this.props.handleSearch(search);
		input.value = '';
    }

	render() {
		return (
			<div className="c-participant-form">
				<form className="[ form-inline ] c-participant-search" onSubmit={ (e) => this.handleSearch(e) }>
					<input id="participantSearch" className="form-control mr-sm-2" type="search" placeholder="Search..." aria-label="Search"/>
					<Button className="btn btn-outline-success my-2 my-sm-0 c-participant-button" onClick={(e) => this.handleSearch(e)}>
						<Glyphicon glyph="search" /> 
					</Button>
					{
						this.props.isResources &&
						<Button className="btn c-participant-button c-participant-plus" data-toggle="modal" data-target="#newResource">
							<Glyphicon glyph="plus" /> 
						</Button>
					}
					{
						this.props.isResourceCategories &&
						<Button className="btn c-participant-button c-participant-plus" data-toggle="modal" data-target="#newResourceCategory">
							<Glyphicon glyph="plus" /> 
						</Button>
					}
				</form>
			</div>
		);
	}
}

export default ParticipantSearch;