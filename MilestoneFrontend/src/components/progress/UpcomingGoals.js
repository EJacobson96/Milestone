/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components
import Goal from './Goal';

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/UpcomingGoals.css';

/////////////////////////////////////////
/// Code

const UpcomingGoals = (props) => {
	props.goals.sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate));
	let goalsWithSortedTasks = props.goals.map((goal) => {
		 return goal.tasks.sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate))
	});
	console.log(props.goals);
	let goals;
	if (props.targetGoalCategoryId) { // add else to get id from path
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
		goals = <Redirect to='/Progress/Goals' />
	}

	return (
		<div className='[ container ] l-upcoming-goals'>
			{ goals }
		</div>
	);

}

export default UpcomingGoals;