/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Glyphicon, Button } from 'react-bootstrap';

/////////////////////////////////////////
/// Standard Components


/////////////////////////////////////////
/// Images & Styles
import '../../css/Network.css';

/////////////////////////////////////////
/// Code

class NetworkSearch extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
        };
		
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
			<div className="">
				<form className="[ form-inline ]">
					<input id="networkSearch" className="form-control mr-sm-2" type="search" placeholder="Search..." aria-label="Search"/>
					<Button className="btn btn-outline-success my-2 my-sm-0" onClick={(e) => this.handleSearch(e)}>
						<Glyphicon glyph="search" /> 
					</Button>
					<Link to="/Network/Contacts/Connect">
						<Button className="btn btn-outline-success my-2 my-sm-0 plus">
							<Glyphicon glyph="plus" /> 
						</Button>
					</Link>
				</form>
			</div>
        );
    }
}

export default withRouter(NetworkSearch);