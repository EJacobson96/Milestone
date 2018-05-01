import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Dev Notes

	/*
	 *
	 */

/////////////////////////////////////////
/// Standard Components
import Goal from './Goal';

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/UpcomingGoals.css';

/////////////////////////////////////////
/// Code

const UpcomingGoals = (props) => {
	
	let sortGoalTasks = props.goals.map((goal) => {
		 return goal.tasks.sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate))
	});
	let targetGoalCategoryId = props.targetGoalCategoryId;
	if (!targetGoalCategoryId) {
		targetGoalCategoryId = props.location.pathname.split(':id')[1];
	}
	let goals = <div></div>;
	let isActive = props.navFilter == "inProgress" ? true : false;
	console.log(props.goals);
	console.log(targetGoalCategoryId);
	console.log(isActive);
	if (props.goals.length > 1) { // add else to get id from path
		const targetGoalCategory = props.goals.filter(goal => goal.id == targetGoalCategoryId);
		const filteredGoals = targetGoalCategory[0].tasks.filter((task) => task.active == isActive)
		goals = filteredGoals.map((task) => {
			return (
				<Goal
					goalCategory={ targetGoalCategory[0] }
					goal={ task } 
					id={ task.id }
					key={ task.id } 
				/>
			);
		});
	}

	return (
		<div className='[ container ] l-upcoming-goals'>
			{ goals }
		</div>
	);

}

export default withRouter(UpcomingGoals);