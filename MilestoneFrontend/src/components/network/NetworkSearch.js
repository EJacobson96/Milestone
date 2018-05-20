/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Glyphicon, Button } from 'react-bootstrap';

/////////////////////////////////////////
/// Standard Components


/////////////////////////////////////////
/// Images & Styles
import '../../css/NetworkSearch.css';

/////////////////////////////////////////
/// Code

class NetworkSearch extends Component {
    constructor(props) {
        super(props);
		
		this.handleSearch = this.handleSearch.bind(this);
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
				<form onSubmit={ (e) => this.handleSearch(e)} className="[ form-inline ] c-network-search">
					<input id="networkSearch" className="form-control mr-sm-2" type="search" placeholder="Search..." aria-label="Search"/>
					<Button className="btn btn-outline-success my-2 my-sm-0 c-network-button" onClick={(e) => this.handleSearch(e)}>
						<Glyphicon glyph="search" /> 
					</Button>
					
					{
						this.props.location.pathname.includes("contacts") &&
						<Link to="/network/contacts/connect">
							<Button className="btn btn-outline-success my-2 my-sm-0 plus c-network-button">
								<Glyphicon glyph="plus" /> 
							</Button>
						</Link>
					}
					{
						this.props.location.pathname.includes("messages") && 
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
}

export default withRouter(NetworkSearch);