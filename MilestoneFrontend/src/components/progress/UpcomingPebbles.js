/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';

/////////////////////////////////////////
/// Standard Components
import Pebble from './Pebble';

/////////////////////////////////////////
/// Images & Styles
import '../../css/UpcomingPebbles.css';

/////////////////////////////////////////
/// Code

class UpcomingPebbles extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }
    
    componentDidMount() {
        // TODO:
    }

    render() {
		var pebbles = this.props.goals.map((goal) => {
			let thesePebbles = goal.Pebbles.map((pebble) => {
				return (
					<Pebble
						goal={ goal }
						pebble={ pebble } 
						key={ pebble.TaskID } 
					/>
				);
			});

			return thesePebbles;
		});

        return (
            <div className='[ container ] c-upcoming-pebbles'>
				<h4 className='c-upcoming-pebbles__heading'>Upcoming</h4>
				<hr className='c-upcoming-pebbles__hr' />

				{ pebbles }
			</div>
        );
    }
}

export default UpcomingPebbles;