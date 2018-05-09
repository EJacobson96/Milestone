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
							<Link to='/Network'>
								<li>
									<Glyphicon glyph="comment" className="c-sidebar__glyph" />
									<span className="c-sidebar__link">
										Network
									</span>
								</li>
							</Link>
							<Link to='/Calendar'>
								<li>
									<Glyphicon glyph="calendar" className="c-sidebar__glyph" />
									<span className="c-sidebar__link">
										Calendar
									</span>
								</li>
							</Link>
							<Link to='/progress'>
								<li>
									<Glyphicon glyph="flag" className="c-sidebar__glyph" />
									<span className="c-sidebar__link">
										Progress
									</span>
								</li>
							</Link>
							<Link to='/Requests'>
								<li>
									<Glyphicon glyph="send" className="c-sidebar__glyph" />
									<span className="c-sidebar__link">
										Requests
									</span>
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