/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components

import GoalDropdown from './GoalDropdown';

/////////////////////////////////////////
/// Images & Styles

import '../../css/progress/Goal.css';

/////////////////////////////////////////
/// Code

const Goal = (props) => {

    function editGoal() {
		props.editTask(props.goalId);
	}

	function markGoalActive() {
		props.markGoalActive(props.goalId);
	}

	function markGoalComplete() {
		props.markGoalComplete(props.goalId);
    }
    
    var linkToGoalId;
    if (props.location.pathname.includes('provider') || props.isServiceProvider) {
        linkToGoalId = '/progress/provider/participants/goals/tasks/:id' + props.goalId;
    } else {
        linkToGoalId = '/progress/goals/:id' + props.goalId;
    }
    let numTasks = 0;
    for (let i = 0; i < props.goal.tasks.length; i++) {
        if (props.goal.tasks[i].active === true && props.goal.tasks[i].completed === false) {
            numTasks++;
        }
    }
    let numTasksText = numTasks + ' Active Task';
    if (numTasks > 1) {
        numTasksText += 's';
    } else if (numTasks === 0) {
        numTasksText = 'No tasks';
    }

    return (
        <div className="c-goal">
            <div className="c-goal__header">
                <GoalDropdown
                    goal={ props.goal }
                    markGoalActive={ (goalId) => markGoalActive(goalId) }
                    markGoalComplete={ (goalId) => markGoalComplete(goalId) }
                    editGoal={ () => editGoal() }
                    isServiceProvider={ props.isServiceProvider }
                />
                { !props.goal.active ? (
                <div className="c-goal__header__pending-flag">
                    <p className='c-goal__header__pending-flag-text'>PENDING</p>
                </div>
                ) : null }
            </div>
            <div className="c-goal__category-info">
                <Link to={ linkToGoalId } onClick={ (e) => props.changeGoalFocus(e, props.goalId, props.goalTitle) }>
                    <p className="c-goal__category-title">{ props.goalTitle }</p>
                    <p className="c-goal__number-of-goals">{ numTasksText }</p>
                </Link>
            </div>
        </div>
    );
}

export default withRouter(Goal);