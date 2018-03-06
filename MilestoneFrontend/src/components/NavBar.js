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
            <div className="c-navbar">
                <Button bsSize="lg" onClick={(e) => this.openSideBar(e)} className="c-navbar__btn">
                    <Glyphicon glyph="menu-hamburger" />
                </Button>
                <div className="c-navbar__logo-wrapper">
                    <div className="c-navbar-logo-container">
                        <img src={ logo } className="c-navbar__logo-img" alt="Milestone Logo" />
                    </div>
                </div>
                <Button bsSize="lg" className="c-navbar__btn">
                    <Glyphicon glyph="user" />                
                </Button>
            </div>
        );
    }
}

export default NavBar;