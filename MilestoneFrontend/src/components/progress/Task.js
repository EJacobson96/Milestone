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
import TaskDropdown from './TaskDropdown';

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/Task.css';
import fakeuser from '../../img/fakeuser.png';
import commentBubble from '../../img/comment.png';

/////////////////////////////////////////
/// Code

const Task = (props) => {

	function editTask() {
		props.editTask(props.task.id);
	}

	function markTaskComplete() {
		props.markTaskComplete(props.task.id);
	}

	let dueDateSpan;
	if (props.task.dueDate != '0001-01-01T00:00:00Z') {
		let dueDate = <Moment format='MM/DD/YY'>{ props.task.dueDate }</Moment>
		dueDateSpan = <span className='c-task__due-date'>Due: { dueDate} </span>
	} else {
		dueDateSpan = <span className='c-task__due-date'>{ props.goal.title }</span>
	}
	let numComments = "NO COMMENTS";
	if (props.task.comments !== null) {
		if (props.task.comments.length > 0) {
			numComments = props.task.comments.length + " COMMENT";
			if (props.task.comments.length > 1) {
				numComments += "S"
			}
		}
	}

	return (
		<div className='c-task'>
				<div className='c-task__header'>
					<img src={ fakeuser } className='c-task__sp-avatar' />
					{ dueDateSpan }
					<TaskDropdown 
						markTaskComplete={ () => markTaskComplete() }
						editTask={ () => editTask() }
					/>


				</div>
				<div className='c-task__body'>
					<p className='c-task__title'> { props.task.title }</p>
					<p className='c-task__description'> { props.task.description }</p>
				</div>
				<div className='c-task__footer'>
					<Link to={ '/progress/goals/comments/:id' + props.taskId }>
						<div className='c-task__footer__comments-link'>
							<img src={ commentBubble } className='c-task__footer__comments-link-icon' />
							<span className='c-task__footer__comments-link-text'>{ numComments }</span>
						</div>
					</Link>
					<div className='c-task__footer__resources-link'>
						<span className='c-task__footer__resources-link-text'>{/*RESOURCES*/}</span>				
					</div>
					{ props.showComments == true &&
					<TaskComments
						currUser={ props.currUser }
						taskId={ props.taskId }
						task={ props.task }
						submitComment={ (comment, taskId) => props.submitComment(comment, taskId) }
					/> }
				</div>
		</div>
	);
}

export default Task;