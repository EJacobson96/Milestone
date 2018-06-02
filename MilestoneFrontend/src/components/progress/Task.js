/////////////////////////////////////////
/// Package imports

import React, { ReactDOM } from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { FormGroup, FormControl, ControlLabel, DropdownButton, Dropdown, MenuItem } from 'react-bootstrap';

/////////////////////////////////////////
/// Dev Notes
	/*
	 * 
	 */

/////////////////////////////////////////
/// Standard Components

import TaskComments from './TaskComments';
import TaskResources from './TaskResources';
import TaskDropdown from './TaskDropdown';

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/Task.css';
import fakeuser from '../../img/fakeuser.png';
import commentBubble from '../../img/comment.png';

/////////////////////////////////////////
/// Code

// A UI component for displaying an existing task. Accepts both the current task and
// the current goal the task is attached to as props. Displays links to the task's 
// attached comments and resources via the TaskComments.js and TaskResources.js components.
const Task = (props) => {

	// Passes the current task's id upwards to ProgressController to initiate the editing
	// of the current task.
	function editTask() {
		props.editTask(props.task.id);
	}

	// Passes the current task's id upwards to ProgressController to initiate 
	// marking the current task as complete.
	function markTaskComplete() {
		props.markTaskComplete(props.task.id, props.goal);
	}

	// Passes the current task's id as well as the current goal upwards to 
	// ProgressController to initiate marking the current task as active (approved). 
	// Applicable only to service provider users.
	function markTaskActive() {
		props.markTaskActive(props.task.id, props.goal);
	}

	// Sets up the task's header. Displays the task's due date if it exists; otherwise
	// displays the task's parent goal name.
	let dueDateSpan;
	if (props.task.dueDate != '0001-01-01T00:00:00Z') {
		let dueDate = <Moment format='MM/DD/YY'>{ props.task.dueDate }</Moment>
		dueDateSpan = <span className='c-task__due-date'>Due: { dueDate} </span>
	} else {
		dueDateSpan = <span className='c-task__due-date'>{ props.goal.title }</span>
	}
	// Sets up a string to display the current number of comments attached to the task.
	let numComments = "NO COMMENTS";
	if (props.task.comments !== null && props.task.comments !== undefined) {
		if (props.task.comments.length > 0) {
			numComments = props.task.comments.length + " COMMENT";
			if (props.task.comments.length > 1) {
				numComments += "S"
			}
		}
	}
	// Sets up a string to display the current number of resources attached to the task.
	let numResources = "NO RESOURCES";
	if (props.task.resources !== null && props.task.resources !== undefined) {
		if (props.task.resources.length > 0) {
			numResources = props.task.resources.length + " RESOURCE";
			if (props.task.resources.length > 1) {
				numResources += "S"
			}
		}
	}
	
	return (
		<div className='c-task'>
				<div className='c-task__header'>
					<img src={ fakeuser } className='c-task__sp-avatar' />
					{ dueDateSpan }
					<TaskDropdown
						task={ props.task }
						markTaskActive={ () => markTaskActive() }
						markTaskComplete={ () => markTaskComplete() }
						editTask={ () => editTask() }
						isServiceProvider={ props.isServiceProvider }
					/>
					{ !props.task.active ? (
					<div className='c-task__header__pending-flag'>
						<p className='c-task__header__pending-flag-text'>PENDING</p>
					</div>
					) : null }
				</div>
				<div className='c-task__body'>
					<p className='c-task__title'> { props.task.title ? props.task.title : props.task.Title }</p>
					<p className='c-task__description'> { props.task.description ? props.task.description : props.task.Description }</p>
				</div>
				<div className='c-task__footer'>
					<Link to={ '/progress/goals/comments/:id' + props.taskId }>
						<div className='c-task__footer__comments-link'>
							<img src={ commentBubble } className='c-task__footer__comments-link-icon' />
							<span className='c-task__footer__comments-link-text'>{ numComments }</span>
						</div>
					</Link>
					<Link to={ '/progress/goals/resources/:id' + props.taskId }>
						<div className='c-task__footer__resources-link'>
							<i className="fas fa-link c-task__footer__resources-fa-icon"></i>
							<span className='c-task__footer__resources-link-text'>{ numResources }</span>				
						</div>
					</Link>
					{ props.showComments === true &&
					<TaskComments
						currUser={ props.currUser }
						taskId={ props.taskId }
						task={ props.task }
						submitComment={ (comment, taskId) => props.submitComment(comment, taskId, props.goal) }
					/> }
					{ props.showResources === true &&
					<TaskResources
						currUser={ props.currUser }
						taskId={ props.taskId }
						task={ props.task }
						submitResource={ (resourceName, resourceUrl, taskId) => props.submitResource(resourceName, resourceUrl, taskId) }
					/> }
				</div>
		</div>
	);
}

export default Task;