/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import Moment from 'react-moment';

/////////////////////////////////////////
/// Standard Components

/////////////////////////////////////////
/// Images & Styles
import '../../css/Pebble.css';
import fakeuser from '../../img/fakeuser.png';

/////////////////////////////////////////
/// Code

class Pebble extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }
    
    componentDidMount() {
        // TODO:
    }

    render() {
		var dueDate = Date.parse(this.props.pebble.DueDate);
		var dueDateString = dueDate.Get

        return (
            <div className='c-upcoming-pebbles__pebble'>
				<div className='c-upcoming-pebbles__pebble__header'>
					<img src={ fakeuser } className='c-upcoming-pebbles__sp-avatar' />
					<span className='c-upcoming-pebbles__pebble__due-date'>● DUE <Moment format='MM/DD/YYYY'>{ this.props.pebble.DueDate }</Moment></span>
				</div>
				<div className='c-upcoming-pebbles__pebble__body'>
					<div className='c-upcoming-pebbles__pebble__goal-title-block'>
						<p className='c-upcoming-pebbles__pebble__goal-title'> { this.props.goal.Title }</p>
					</div>
					<p className='c-upcoming-pebbles__pebble__pebble-title'> { this.props.pebble.Title }</p>
					<p className='c-upcoming-pebbles__pebble__pebble-description'> { this.props.pebble.Description }</p>
				</div>
				<div className='c-upcoming-pebbles__pebble__footer'>
				</div>
			</div>
        );
    }
}

export default Pebble;