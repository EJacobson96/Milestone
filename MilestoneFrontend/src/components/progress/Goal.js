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

// A stateless component for rendering a participant's specific goal.
const Goal = (props) => {

    // Passes the current goal's id upwards to ProgressController to initiate
    // editing of the specific goal. Triggered on user selecting the 'Edit Goal'
    // option from a goal's dropdown menu.
    function editGoal() {
		props.editTask(props.goalId);
	}

    // Passes the current goal's id upwards to ProgressController to initiate
    // marking a specific goal as active (approved). Triggered on user selecting 
    // the 'Edit Goal' option from a goal's dropdown menu. Available only to
    // service provider users.
	function markGoalActive() {
		props.markGoalActive(props.goalId);
	}

    // Passes the current goal's id upwards to ProgressController to initiate
    // marking the specific goal complete. Triggered on user selecting the 'Edit Goal'
    // option from a goal's dropdown menu.
	function markGoalComplete() {
		props.markGoalComplete(props.goalId);
    }
    
    // Sets up the link to view the goal's tasks.
    var linkToGoalId;
    if (props.location.pathname.includes('provider') || props.isServiceProvider) {
        linkToGoalId = '/progress/provider/participants/goals/tasks/:id' + props.goalId;
    } else {
        linkToGoalId = '/progress/goals/:id' + props.goalId;
    }
    // Sets up the count of the goal's active vs. pending tasks.
    let numActiveTasks = 0;
    let numPendingTasks = 0;
    let numTotalTasksShown = 0;
    for (let i = 0; i < props.goal.tasks.length; i++) {
        if (props.goal.tasks[i].active === true && props.goal.tasks[i].completed === false) {
            numActiveTasks++;
            numTotalTasksShown++;
        }
        if (props.goal.tasks[i].active === false && props.goal.tasks[i].completed === false) {
            numPendingTasks++;
            numTotalTasksShown++;
        }
    }
    let numTasksText = numActiveTasks + " Active";
    if (numPendingTasks > 0) {
        numTasksText += ", " + numPendingTasks + " Pending";
    }
    if (numTotalTasksShown > 2 || numTotalTasksShown === 0) {
        numTasksText += " Tasks";
    } else {
        numTasksText += " Task";
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