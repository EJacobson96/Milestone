/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import Axios from 'axios';
// import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components
import GoalSelectorItem from './GoalSelectorItem';
import GoalSelectorAddItem from './GoalSelectorAddItem';

/////////////////////////////////////////
/// Images & Styles
import '../../css/GoalSelector.css';

/////////////////////////////////////////
/// Code

const GoalSelector = (props) => {
    var goalItems = props.goals.goals.map((goal) => { // Change as necessary
        return (
            <GoalSelectorItem 
                title={ goal.Title }
                status={ goal.Active ? "Active" : "Finished" }
                numberOfPebbles={ goal.Pebbles.length }
                key={ goal.GoalID }
            />
        );
    });

    return (
        <div className="c-goal-selector">
            { goalItems }
            <GoalSelectorAddItem />
        </div>
    )
}

export default GoalSelector;