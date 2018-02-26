/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components
import PageMask from '../components/PageMask';

/////////////////////////////////////////
/// Images & Styles
import '../css/SideBar.css';

/////////////////////////////////////////
/// Code

class SideBar extends React.Component {
    constructor(props) {
        super(props);
    
        // this.handleChange = this.handleChange.bind(this);
    
        this.state = {
            value: ''
        };
	}
	
	closeSideBar(e) {
		e.preventDefault();

		this.props.closeSideBar();
	}

    render() {
        return (
			<div>

				<PageMask />

				<div className="ms-sidebar">

					<div className="ms-sidebar-top">
						<a className="" onClick={(e) => this.closeSideBar(e)}>
							<Glyphicon glyph="remove" />
						</a>
					</div>

					<div className="ms-sidebar-links">
						<ul>
							<Link to='/'>
								<li>
									<Glyphicon glyph="comment" className="ms-sidebar-glyph" />
									<a className="ms-sidebar-link" href="#network">
										Network
									</a>
								</li>
							</Link>
							<Link to='/calendar'>
								<li>
									<Glyphicon glyph="calendar" className="ms-sidebar-glyph" />
									<a className="ms-sidebar-link" href="#calendar">Calendar</a>
								</li>
							</Link>
							<Link to='progress'>
								<li>
									<Glyphicon glyph="flag" className="ms-sidebar-glyph" />
									<a className="ms-sidebar-link" href="#progress">Progress</a>
								</li>
							</Link>
							<Link to='requests'>
								<li>
									<Glyphicon glyph="send" className="ms-sidebar-glyph" />
									<a className="ms-sidebar-link" href="#requests">Requests</a>
								</li>
							</Link>
						</ul>
					</div>

				</div>
				
			</div>
        );
    }
}

export default SideBar;