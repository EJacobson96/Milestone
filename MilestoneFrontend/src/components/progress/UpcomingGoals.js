/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';

/////////////////////////////////////////
/// Standard Components
import Goal from './Goal';

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/UpcomingGoals.css';

/////////////////////////////////////////
/// Code

const UpcomingGoals = (props) => {
	let goals;
	if (props.targeGoalCategoryId) {
		const targetGoalCategory = props.goals.filter(goal => goal.GoalID == props.targeGoalCategoryId);
		goals = targetGoalCategory[0].Pebbles.map((pebble) => { // ADJUST NAME WHEN NECESSARY
			return (
				<Goal
					goalCategory={ targetGoalCategory[0] }
					goal={ pebble } 
					key={ pebble.TaskID } 
				/>
			);
		});
	} else {
		goals = <h1>Oops! Go back.</h1>
	}

	return (
		<div className='[ container ] l-upcoming-goals'>
			{ goals }
		</div>
	);

}

export default UpcomingGoals;