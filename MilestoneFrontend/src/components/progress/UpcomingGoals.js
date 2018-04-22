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
	console.log(props);
	if (props.targetGoalCategoryId) {
		const targetGoalCategory = props.goals.filter(goal => goal.id == props.targetGoalCategoryId);
		goals = targetGoalCategory[0].tasks.map((task) => { // ADJUST NAME WHEN NECESSARY
			return (
				<Goal
					goalCategory={ targetGoalCategory[0] }
					goal={ task } 
					key={ task.id } 
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