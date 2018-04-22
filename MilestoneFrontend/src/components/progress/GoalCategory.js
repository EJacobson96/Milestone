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
    // console.log(props);
    const linkToGoalId = '/Progress/Goals/:id' + props.id;
    let numberOfGoals = props.numberOfGoals + ' Goal';
    if (props.numberOfGoals > 1) {
        numberOfGoals + 's';
    } else if (props.numberOfGoals === 0) {
        numberOfGoals = 'No goals';
    }

    return (
        <div className="c-goal-category">
            <Link to={ linkToGoalId } onClick={ (e) => props.changeGoalCategory(e, props.id, props.title) }>
                <div className="c-goal-category__category-info">
                    <p className="c-goal-category__category-title">{ props.title }</p>
                    <p className="c-goal-category__number-of-goals">{ numberOfGoals }</p>
                </div>
            </Link>
        </div>
    );
}

export default GoalCategory;