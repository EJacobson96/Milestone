/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { Glyphicon, Button } from 'react-bootstrap';

/////////////////////////////////////////
/// Images & Styles
import logo from '../img/logo.png';
import '../css/NavBar.css';

/////////////////////////////////////////
/// Code

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
                <Button bsSize="lg" onClick={(e) => this.openSideBar(e)}>
                    <Glyphicon glyph="menu-hamburger" />
                </Button>
                {/* <a href="#home">M</a> */}
                <div className="ms-navbar-logo-wrapper">
                    <img src={ logo } className="ms-navbar-logo"/>
                </div>
                <Button bsSize="lg" 
                // className="user-link pull-right"
                >
                    <Glyphicon glyph="user" />                
                </Button>
            </div>
        );
    }
}

export default NavBar;