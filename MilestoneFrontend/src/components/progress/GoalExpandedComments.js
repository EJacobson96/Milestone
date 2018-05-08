/////////////////////////////////////////
/// Package imports

import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';

/////////////////////////////////////////
/// Dev Notes

	/*
	 * 
	 */

/////////////////////////////////////////
/// Standard Components

import Goal from './Goal';
import fakeuser from '../../img/fakeuser.png';
import commentBubble from '../../img/comment.png';

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/GoalExpandedComments.css';

/////////////////////////////////////////
/// Code

const GoalExpandedComments = (props) => {
	const targetGoalId = props.location.pathname.split(':id')[1];
	let targetGoal = false;
	let targetGoalCategory = null;
	for (let i = 0; i < props.goals.length; i++) {
		for (let j = 0; j < props.goals[i].tasks.length; j++) {
			if (props.goals[i].tasks[j].id == targetGoalId) {
				targetGoal = props.goals[i].tasks[j];
				targetGoalCategory = props.goals[i];
			}
		}
	}

	return (
		targetGoal ?
		<div className='[ container ] l-goal-expanded-comments'>
			<Goal
				currUser={ props.currUser }
				goalCategory={ targetGoalCategory }
				goal={ targetGoal } 
				id={ targetGoal.id }
				submitComment={ (comment, taskId) => props.submitComment(comment, taskId) }
				showComments={ true }
			/>
		</div>
		:
		<Redirect to='/Progress/Goals' />
	);
}

export default withRouter(GoalExpandedComments);