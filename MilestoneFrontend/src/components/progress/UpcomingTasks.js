/////////////////////////////////////////
/// Package imports

import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Dev Notes

	/*
	 *
	 */

/////////////////////////////////////////
/// Standard Components
import Task from './Task';

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/UpcomingTasks.css';

/////////////////////////////////////////
/// Code

const UpcomingTasks = (props) => {
	
	let sortGoalTasks = props.goals.map((goal) => {
		 return goal.tasks.sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate))
	});
	let targetGoalId = props.targetGoalId;
	// if (!targetGoalId) {
	// 	targetGoalId = props.location.pathname.split(':id')[1];
	// 	props.updateCurrGoalCatId(targetGoalId);
	// }
	let tasks = <Redirect to='/progress/goals/'></Redirect>; // <div></div>;
	let isActive = props.navFilter == "inProgress" ? true : false;
	if (props.goals.length > 1 && targetGoalId) { // add else to get id from path
		const targetGoal = props.goals.filter(goal => goal.id == targetGoalId);
		const filteredGoals = targetGoal[0].tasks.filter((task) => task.active == isActive)
		tasks = filteredGoals.map((task) => {
			return (
				<Task
					goal={ targetGoal[0] }
					task={ task } 
					taskId={ task.id }
					key={ task.id }
					editTask={ (taskId) => props.editTask(taskId) }
					markTaskComplete={ (taskId) => props.markTaskComplete(taskId) }
				/>
			);
		});
	}

	return (
		<div className='[ container ] l-upcoming-goals'>
			{ tasks }
		</div>
	);

}

export default withRouter(UpcomingTasks);