/////////////////////////////////////////
/// Dev Notes

import React from 'react';
import Moment from 'react-moment';

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
				<span className='c-goal__due-date'>● DUE <Moment format='MM/DD/YYYY'>{ props.goal.DueDate }</Moment></span>
			</div>
			<div className='c-goal__body'>
				<div className='c-goal__category-title-block'>
					<p className='c-goal__category-title'> { props.goalCategory.Title }</p>
				</div>
				<p className='c-goal__title'> { props.goal.Title }</p>
				<p className='c-goal__description'> { props.goal.Description }</p>
			</div>
			<div className='c-goal__footer'>
			</div>
		</div>
	);
}

export default Goal;