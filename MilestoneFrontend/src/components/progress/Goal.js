/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/Goal.css';

/////////////////////////////////////////
/// Code

const Goal = (props) => {
    const linkToGoalId = '/progress/goals/:id' + props.goalId;
    let numTasks = 0;
    for (let i = 0; i < props.goal.tasks.length; i++) {
        if (props.goal.tasks[i].active === true) {
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
            <Link to={ linkToGoalId } onClick={ (e) => props.changeGoalFocus(e, props.goalId, props.goalTitle) }>
                <div className="c-goal__category-info">
                    <p className="c-goal__category-title">{ props.goalTitle }</p>
                    <p className="c-goal__number-of-goals">{ numTasksText }</p>
                </div>
            </Link>
        </div>
    );
}

export default Goal;