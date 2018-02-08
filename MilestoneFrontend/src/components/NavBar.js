import React, { Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

import '../css/NavBar.css';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
    
        // this.handleChange = this.handleChange.bind(this);
    
        this.state = {
            value: ''
        };
    }

    render() {
        return (
            <div class="ms-navbar">

                <a href="#home">Home</a>
                <a href="#news">News</a>
                <a href="#contact">Contact</a>
            </div>
        );
    }
}

export default NavBar;