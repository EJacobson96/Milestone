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

/////////////////////////////////////////
/// Code

const Goal = (props) => {
	return (
		<div className='c-goal'>
			<div className='c-goal__header'>
				<img src={ fakeuser } className='c-goal__sp-avatar' />
				<span className='c-goal__due-date'>● DUE <Moment format='MM/DD/YYYY'>{ props.goal.dueDate }</Moment></span>
			</div>
			<div className='c-goal__body'>
				<div className='c-goal__category-title-block'>
					<p className='c-goal__category-title'> { props.goalCategory.title }</p>
				</div>
				<p className='c-goal__title'> { props.goal.title }</p>
				<p className='c-goal__description'> { props.goal.description }</p>
			</div>
			<div className='c-goal__footer'>
			</div>
		</div>
	);
}

export default Goal;