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
    let numberOfTasks = props.numberOfTasks + ' Task';
    if (props.numberOfTasks > 1) {
        numberOfTasks += 's';
    } else if (props.numberOfTasks === 0) {
        numberOfTasks = 'No goals';
    }

    return (
        <div className="c-goal">
            <Link to={ linkToGoalId } onClick={ (e) => props.changeGoalFocus(e, props.goalId, props.goalTitle) }>
                <div className="c-goal__category-info">
                    <p className="c-goal__category-title">{ props.goalTitle }</p>
                    <p className="c-goal__number-of-goals">{ numberOfTasks }</p>
                </div>
            </Link>
        </div>
    );
}

export default Goal;