/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import Axios from 'axios';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components

import HeaderBar from '../ux/HeaderBar';

/////////////////////////////////////////
/// Images & Styles

import '../../css/progress/NewGoal.css';

/////////////////////////////////////////
/// Code

const NewGoal = (props) => {

	return (
		<div className='l-new-goal'>
			<HeaderBar 
				text={ 'New Goal' }
			/>
			<div className='c-new-goal-form'>
				<form>
					<FormGroup
						controlId={ 'newGoalForm' }
					>
						<div className='[ container ] c-new-goal-form__section'>
							<h4 className='c-new-goal-form__section-heading'>
								Goal name
							</h4>
							<FormControl
								type='text'
								placeholder='Type in your goal...'
							/>
						</div>
					</FormGroup>
					<hr className='c-new-goal-form__divider' />
				</form>			
			</div>
		</div>
	)
};

export default NewGoal;