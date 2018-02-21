/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon, Button } from 'react-bootstrap';

/////////////////////////////////////////
/// Standard Components
import Contacts from './Contacts';

/////////////////////////////////////////
/// Images & Styles
import '../css/Network.css';

/////////////////////////////////////////
/// Code

class Network extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            value: '',
        };
    }

    toggleLinks(e) {
        var links = document.querySelectorAll(".mainNav a");
        for (let i = 0; i < links.length; i++) {
            links[i].className = "";
            if (links[i] == e.target) {
                links[i].className = "activeLink";
            } else {
                links[i].className = "nonActiveLink";
            }
        }
        this.setState ({
        })
    }

    render() {
        return (
            <div>
                <ul class="mainNav">
                    <li role="presentation"><Link to="" className="activeLink" onClick={(e) => this.toggleLinks(e)}>Messages</Link></li>
                    <li role="presentation"><Link to="" className="nonActiveLink" onClick={(e) => this.toggleLinks(e)}>Contacts</Link></li>
                </ul>
                <div className="networkContent">
                    <form class="form-inline">
                        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
                        <Button class="btn btn-outline-success my-2 my-sm-0" type="submit">
                            <Glyphicon glyph="search" /> 
                        </Button>
                    </form>
                    <Contacts />
                </div>
            </div>
        );
    }
}

export default Network;