/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import Axios from 'axios';
// import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components
import GoalCategory from './GoalCategory';

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/GoalCategories.css';

/////////////////////////////////////////
/// Code

const GoalCategories = (props) => {
    var goalCategories = props.goals.goals.map((goal) => { // Change as necessary
        return (
            <GoalCategory
            title={ goal.Title }
            status={ goal.Active ? "Active" : "Finished" }
            numberOfPebbles={ goal.Pebbles.length }
            id={ goal.GoalID }
            key={ goal.GoalID }
            changeGoalCategory = { (e, i, t) => props.changeGoalCategory(e, i, t) }
            />
        );
    });
    
    return (
        <div className="c-goal-categories">
            { goalCategories }
        </div>
    )
}

export default GoalCategories;