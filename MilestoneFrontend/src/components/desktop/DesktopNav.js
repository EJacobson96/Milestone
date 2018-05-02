/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon, Button} from 'react-bootstrap';

/////////////////////////////////////////
/// Images & Styles
import logo from '../../img/logo.png';
import '../../css/DesktopNav.css';

/////////////////////////////////////////
/// Code

class DesktopNav extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            value: ''
        };
    }
    render() {
        return (
            <div className="c-navbar">
              <div className="container">
                <Link to="/Network">
                  <img src={ logo } className="milestoneLogo" alt="Milestone Logo" />
                </Link>
                <Link className="navLink" to='/Network'>
                  <i className="fas fa-comments"></i>
                  <p>Network</p>
                </Link>
                <Link className="navLink" to='/Calendar'>
                  <i className="far fa-calendar"></i>
                  <p>Calendar</p>
                </Link>
                <Link className="navLink" to='/Progress'>
                  <i className="far fa-flag"></i>
                  <p>Progress</p>
                </Link>
                <Link className="navLink" to='/Requests'>
                  <i className="far fa-paper-plane"></i>
                  <p>Requests</p>
                </Link>
                <Button bsSize="lg" className="c-navbar__btn">
                    <Glyphicon glyph="user" />                
                </Button>
              </div>
            </div>
        );
    }
}

export default DesktopNav;