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
		props.updateCurrGoalCatId(targetGoalCategoryId);
	}
	let goals = <Redirect to='/Progress/Goals/'></Redirect>; // <div></div>;
	let isActive = props.navFilter == "inProgress" ? true : false;
	if (props.goals.length > 1 && targetGoalCategoryId !== undefined) { // add else to get id from path
		const targetGoalCategory = props.goals.filter(goal => goal.id == targetGoalCategoryId);
		const filteredGoals = targetGoalCategory[0].tasks.filter((task) => task.active == isActive)
		goals = filteredGoals.map((task) => {
			return (
				<Goal
					goalCategory={ targetGoalCategory[0] }
					goal={ task } 
					id={ task.id }
					key={ task.id }
					submitComment={ (comment, taskId) => props.submitComment(comment, taskId) }
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