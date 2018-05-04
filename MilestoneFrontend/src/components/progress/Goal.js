/////////////////////////////////////////
/// Package imports

import React from 'react';
import Moment from 'react-moment';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

/////////////////////////////////////////
/// Dev Notes

	/*
	 * 
	 */

/////////////////////////////////////////
/// Standard Components

import GoalComments from './GoalComments';

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/Goal.css';
import fakeuser from '../../img/fakeuser.png';
import commentBubble from '../../img/comment.png';

/////////////////////////////////////////
/// Code

const Goal = (props) => {

	function handleCommentsClick() {
		let targetDiv = document.getElementById('comments-id-' + props.id);
		if (!targetDiv.style.display || targetDiv.style.display == "none") {
			targetDiv.style.display = "block";
		} else {
			targetDiv.style.display = "none";
		}
	}

	let dueDateSpan;
	if (props.goal.dueDate != '0001-01-01T00:00:00Z') {
		let dueDate = <Moment format='MM/DD/YY'>{ props.goal.dueDate }</Moment>
		dueDateSpan = <span className='c-goal__due-date'>Due: { dueDate} </span>
	} else {
		dueDateSpan = <span className='c-goal__due-date'>{ props.goalCategory.title }</span>
	}
	return (
		<div className='c-goal'>
			<div className='c-goal__header'>
				<img src={ fakeuser } className='c-goal__sp-avatar' />
				{ dueDateSpan }
			</div>
			<div className='c-goal__body'>
				<p className='c-goal__title'> { props.goal.title }</p>
				<p className='c-goal__description'> { props.goal.description }</p>
			</div>
			<div className='c-goal__footer'>
				<div className='c-goal__footer__comments-link' onClick={ () => handleCommentsClick() }>
					<img src={ commentBubble } className='c-goal__footer__comments-link-icon' />
					<span className='c-goal__footer__comments-link-text'>COMMENTS</span>
				</div>
				<div className='c-goal__footer__resources-link'>
					<span className='c-goal__footer__resources-link-text'>RESOURCES</span>				
				</div>
				<GoalComments
					id={ props.id }
					submitComment={ (comment, taskId) => props.submitComment(comment, taskId) }
				/>
			</div>
		</div>
	);
}

export default Goal;