/////////////////////////////////////////
/// Package imports

import React from 'react';
import Moment from 'react-moment';

/////////////////////////////////////////
/// Dev Notes

	/*
	 * 
	 */

/////////////////////////////////////////
/// Standard Components

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/Goal.css';
import fakeuser from '../../img/fakeuser.png';
import commentBubble from '../../img/comment.png';

/////////////////////////////////////////
/// Code

const Goal = (props) => {
	let dueDateSpan;
	// console.log(props.goal.dueDate)
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
				{/* <span className='c-goal__category-title'>{ props.goalCategory.title }</span> */}
				{ dueDateSpan }
			</div>
			<div className='c-goal__body'>
				{/* <div className='c-goal__category-title-block'>
					<p className='c-goal__category-title'> { props.goalCategory.title }</p>
				</div> */}
				<p className='c-goal__title'> { props.goal.title }</p>
				<p className='c-goal__description'> { props.goal.description }</p>
			</div>
			<div className='c-goal__footer'>
				<div className='c-goal__footer__comments-link'>
					<img src={ commentBubble } className='c-goal__footer__comments-link-icon' />
					<span className='c-goal__footer__comments-link-text'>COMMENTS</span>
				</div>
				<div className='c-goal__footer__resources-link'>
					<span className='c-goal__footer__resources-link-text'>RESOURCES</span>				
				</div>
			</div>
		</div>
	);
}

export default Goal;