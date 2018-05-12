/////////////////////////////////////////
/// Package imports

import React, { Component } from 'react';
import Axios from 'axios';

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
import '../../css/progress/Goals.css';

/////////////////////////////////////////
/// Code

class Goals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

	componentWillMount() {
        console.log("hello");
		this.props.refreshUser();
    }
    
    componentWillReceiveProps() {
        
    }

    render() {
        const goals = this.props.goals.map((goal) => {
            return (
                <Goal
                    goal={ goal }
                    goalTitle={ goal.title }
                    status={ goal.active ? "Active" : "Finished" }
                    numberOfTasks={ goal.tasks.length }
                    goalId={ goal.id }
                    key={ goal.id }
                    changeGoalFocus={ (e, goalId, goalTitle) => this.props.changeGoalFocus(e, goalId, goalTitle) }
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

export default Goals;