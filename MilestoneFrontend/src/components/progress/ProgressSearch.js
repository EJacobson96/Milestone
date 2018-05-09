/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon, Button } from 'react-bootstrap';

/////////////////////////////////////////
/// Standard Components


/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/ProgressSearch.css';

/////////////////////////////////////////
/// Code

function ProgressSearch(props) {
    return (
        <div className="c-progress-form">
            <form className="[ form-inline ] c-progress-search">
                <input id="progressSearch" className="form-control mr-sm-2" type="search" placeholder="Search..." aria-label="Search"/>
                <Button className="btn btn-outline-success my-2 my-sm-0 c-progress-search__search-button" onClick={(e) => props.handleSearch(e)}>
                    <Glyphicon glyph="search" /> 
                </Button>
                <Link to={ props.addBtnLink }>
                    <Button className="btn btn-outline-success my-2 my-sm-0 plus c-network-button">
                        <Glyphicon glyph="plus" /> 
                    </Button>
                </Link>
            </form>
        </div>
    );
}

export default ProgressSearch;