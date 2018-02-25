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

				<div className="c-sidebar">

					<div className="c-sidebar__top">
						<a onClick={(e) => this.closeSideBar(e)} className="c-sidebar__top__link">
							<Glyphicon glyph="remove" />
						</a>
					</div>

					<div>
						<ul className="c-sidebar__links-wrapper">
							<li>
								<Glyphicon glyph="comment" className="c-sidebar__glyph" />
								<Link to="/Network" className="c-sidebar__link">
									Network
								</Link>
							</li>
							<li>
								<Glyphicon glyph="calendar" className="c-sidebar__glyph" />
								<Link to="/Calendar" className="c-sidebar__link">
									Calendar
								</Link>
							</li>
							<li>
								<Glyphicon glyph="flag" className="c-sidebar__glyph" />
								<Link to="/Progress" className="c-sidebar__link">
									Progress
								</Link>
							</li>
							<li>
								<Glyphicon glyph="send" className="c-sidebar__glyph" />
								<Link to="Requests" className="c-sidebar__link">
									Requests
								</Link>
							</li>
						</ul>
					</div>

				</div>
				
			</div>
        );
    }
}

export default SideBar;