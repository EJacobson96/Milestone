/////////////////////////////////////////
/// Package imports

import React, { Component } from 'react';

/////////////////////////////////////////
/// Dev Notes

	/*
	 * This component is a class only to be able to access lifecycle.
     * _Please_ keep it stateless, and otherwise treat it as a 
     * functional component.
	 */

/////////////////////////////////////////
/// Standard Components
import Goal from './Goal';

/////////////////////////////////////////
/// Images & Styles
// import '../../css/progress/Goals.css';

/////////////////////////////////////////
/// Code

// A component for displaying the results of a search query on a specific participant's goals.
// Similar to the Goals.js component, 
class ProgressSearchResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

	componentWillMount() {
		this.props.refreshUser();
	}

    render() {
		const active = (this.props.navFilter === 'inProgress');
		const filteredGoals = this.props.goals.filter((goal) => goal.active === active);
        const goals = filteredGoals.map((goal) => {
            return (
                <Goal
                    goal={ goal }
                    goalTitle={ goal.title }
                    status={ goal.active ? "Active" : "Finished" }
                    numberOfTasks={ goal.tasks.length }
                    goalId={ goal.id }
                    key={ goal.id }
                    changeGoalFocus={ (e, goalId, goalTitle) => this.props.changeGoalFocus(e, goalId, goalTitle) }
                    isServiceProvider={ this.props.isServiceProvider }
                />
            );
        });
        
        return (
            <div className="c-goals">
                { goals }
            </div>
        )
    }
}

export default ProgressSearchResults;