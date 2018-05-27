/////////////////////////////////////////
/// Dev Notes

import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Glyphicon, Button } from 'react-bootstrap';

/////////////////////////////////////////
/// Standard Components


/////////////////////////////////////////
/// Images & Styles
import '../../css/network/NetworkSearch.css';

/////////////////////////////////////////
/// Code

//handles search for a user's messages and connections
function NetworkSearch(props) {

	//calls handleSearch callback using search input and re-renders the content being display
    function handleSearch(e) {
        e.preventDefault();
        let input = document.getElementById('networkSearch');
		let search = input.value;
		props.handleSearch(search);
		input.value = '';
    }

	return (
		<div className="c-network-form">
			<form onSubmit={ (e) => handleSearch(e)} className="[ form-inline ] c-network-search">
				<input id="networkSearch" className="form-control mr-sm-2" type="search" placeholder="Search..." aria-label="Search"/>
				<Button className="btn btn-outline-success my-2 my-sm-0 c-network-button" onClick={(e) => handleSearch(e)}>
					<Glyphicon glyph="search" /> 
				</Button>
				{
					props.location.pathname.includes("contacts") &&
					<Link to="/network/contacts/connect">
						<Button className="btn btn-outline-success my-2 my-sm-0 plus c-network-button">
							<Glyphicon glyph="plus" /> 
						</Button>
					</Link>
				}
				{
					props.location.pathname.includes("messages") && 
					<Link to='/network/messages/new'>
						<Button className="btn btn-outline-success my-2 my-sm-0 plus c-network-button">
							<Glyphicon glyph="plus" /> 
						</Button>
					</Link>
				}
			</form>
		</div>
	);
}

export default withRouter(NetworkSearch);