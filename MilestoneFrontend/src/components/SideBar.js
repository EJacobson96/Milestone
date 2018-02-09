import React, { Component } from 'react';
import {Glyphicon} from 'react-bootstrap';
import PageMask from '../components/PageMask';

import '../css/SideBar.css';

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
							<li>
								<Glyphicon glyph="comment" className="ms-sidebar-glyph" />
								<a className="ms-sidebar-link" href="#network">
									Network
								</a>
							</li>
							<li>
								<Glyphicon glyph="calendar" className="ms-sidebar-glyph" />
								<a className="ms-sidebar-link" href="#calendar">Calendar</a>
							</li>
							<li>
								<Glyphicon glyph="flag" className="ms-sidebar-glyph" />
								<a className="ms-sidebar-link" href="#progress">Progress</a>
							</li>
							<li>
								<Glyphicon glyph="send" className="ms-sidebar-glyph" />
								<a className="ms-sidebar-link" href="#requests">Requests</a>
							</li>
						</ul>
					</div>

				</div>
				
			</div>
        );
    }
}

export default SideBar;