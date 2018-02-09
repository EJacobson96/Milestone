import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';


import '../css/NavBar.css';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
    
        this.openSideBar = this.openSideBar.bind(this);
    
        this.state = {
            value: ''
        };
    }

    openSideBar(e) {
        e.preventDefault();
        
        this.props.openSideBar();
    }

    render() {
        return (
            <div className="ms-navbar">
                <a className="" onClick={(e) => this.openSideBar(e)}>
                    <Glyphicon glyph="menu-hamburger" />
                </a>
                <a href="#home">M</a>
                <a className="user-link pull-right" href="#profile">
                    <Glyphicon glyph="user" />                
                </a>
            </div>
        );
    }
}

export default NavBar;