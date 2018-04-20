/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/GoalCategory.css';

/////////////////////////////////////////
/// Code

const GoalCategory = (props) => {
    const linkToGoalId = '/Progress/Goals/:id' + props.id;
    let numGoals = props.numberOfPebbles + " Goal";
    if (props.numberOfPebbles > 1) {
        numGoals + "s";
    }

    return (
        <div className="c-goal-category">
            <Link to={ linkToGoalId } onClick={ (e) => props.changeGoalCategory(e, props.id, props.title) }>
                <div className="c-goal-category__category-info">
                    <p className="c-goal-category__category-title">{ props.title }</p>
                    <p className="c-goal-category__number-of-goals">{ numGoals }</p>
                </div>
            </Link>
        </div>
    );
}

export default GoalCategory;