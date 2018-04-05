/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import Axios from 'axios';
// import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components
import GoalSelectorItem from './GoalSelectorItem';
import GoalSelectorAddItem from './GoalSelectorAddItem';

import goalData from '../testdata/fakegoals.json';

/////////////////////////////////////////
/// Images & Styles
import '../../css/GoalSelector.css';

/////////////////////////////////////////
/// Code

class GoalSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goals: this.props.goals
        };

    }
    
    componentDidMount() {
        // TODO:
    }

    render() {
		console.log(this.props.goals);
		var goalItems = this.props.goals.map((goal) => {
			return (
				<GoalSelectorItem 
					title={ goal.Title }
					status={ goal.Active ? "Active" : "Finished" }
					numberOfPebbles={ goal.Pebbles.length }
					key={ goal.GoalID }
				/>
			);
		});
        return (
            <div className="c-goal-selector">
				{ goalItems }
				<GoalSelectorAddItem />
			</div>
        );
    }
}

export default GoalSelector;