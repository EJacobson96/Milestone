/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import Axios from 'axios';

/////////////////////////////////////////
/// Standard Components
import GoalCategory from './GoalCategory';

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/GoalCategories.css';

/////////////////////////////////////////
/// Code

const GoalCategories = (props) => {
    // console.log(props.goals);
    var goalCategories = props.goals.map((goal) => { // Change as necessary
        return (
            <GoalCategory
            title={ goal.title }
            status={ goal.active ? "Active" : "Finished" }
            numberOfGoals={ goal.tasks.length }
            id={ goal.id }
            key={ goal.id }
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