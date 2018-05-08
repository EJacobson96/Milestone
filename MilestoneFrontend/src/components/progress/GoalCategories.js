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
import GoalCategory from './GoalCategory';

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/GoalCategories.css';

/////////////////////////////////////////
/// Code

class GoalCategories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

	componentWillMount() {
		this.props.refreshUser();
	}

    render() {
        const goalCategories = this.props.goals.map((goal) => {
            return (
                <GoalCategory
                    title={ goal.title }
                    status={ goal.active ? "Active" : "Finished" }
                    numberOfGoals={ goal.tasks.length }
                    id={ goal.id }
                    key={ goal.id }
                    changeGoalCategory = { (e, i, t) => this.props.changeGoalCategory(e, i, t) }
                />
            );
        });
        
        return (
            <div className="c-goal-categories">
                { goalCategories }
            </div>
        )
    }
}

export default GoalCategories;