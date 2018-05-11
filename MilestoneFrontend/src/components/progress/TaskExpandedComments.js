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

import Task from './Task';
import fakeuser from '../../img/fakeuser.png';
import commentBubble from '../../img/comment.png';

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/TaskExpandedComments.css';

/////////////////////////////////////////
/// Code

const TaskExpandedComments = (props) => {
	const targetTaskId = props.location.pathname.split(':id')[1];
	let targetTask = false;
	let targetGoal = null;
	for (let i = 0; i < props.goals.length; i++) {
		for (let j = 0; j < props.goals[i].tasks.length; j++) {
			if (props.goals[i].tasks[j].id == targetTaskId) {
				targetTask = props.goals[i].tasks[j];
				targetGoal = props.goals[i];
			}
		}
	}

	return (
		targetTask ?
		<div className='[ container ] l-task-expanded-comments'>
			<Task
				currUser={ props.currUser }
				goal={ targetGoal }
				task={ targetTask } 
				taskId={ targetTask.id }
				submitComment={ (comment, taskId) => props.submitComment(comment, taskId) }
				showComments={ true }
				editTask={ (taskId) => props.editTask(taskId) }
				markTaskComplete={ (taskId) => props.markTaskComplete(taskId) }
			/>
		</div>
		:
		<Redirect to='/progress/goals' />
	);
}

export default withRouter(TaskExpandedComments);