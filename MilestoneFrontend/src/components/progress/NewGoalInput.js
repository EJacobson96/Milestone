/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';

	/*
	 * This component is has state in order to manage the goal input,
	 * validate the input, manage the datepicker and  pass data back to the controller. 
	 * Other state should be kept to a minimum.
	 */

/////////////////////////////////////////
/// Standard Components

import WideDatepicker from './WideDatepicker';

/////////////////////////////////////////
/// Images & Styles

import '../../css/progress/NewGoal.css';

/////////////////////////////////////////
/// Code

class NewGoalInput extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			startDate: moment(),
			goalTitle: '',
			goalDescription: ''
		};
		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
	}

	handleDateChange(date) {
		this.setState({
		  	dueDate: date
		});

		this.props.handleDateChange(date);
	}	

	handleTitleChange(e) {
		this.setState({
			goalTitle: e.target.value
		});

		this.props.handleTitleChange(e.target.value);
	}	

	handleDescriptionChange(e) {
		this.setState({
			goalDescription: e.target.value
		});

		this.props.handleDescriptionChange(e.target.value);
	}
	
	render() {
		return (
			<div>
				<div className='[ container ] c-new-goal-form__section'>
					<h4 className='c-new-goal-form__section-heading'>
						Goal name
					</h4>
					<FormControl
						type='text'
						value={ this.state.goalTitle }
						onChange={ this.handleTitleChange }
						placeholder='Type in your goal...'
					/>
				</div>

				<hr className='c-new-goal-form__divider' />

				<div className='[ container ] c-new-goal-form__section'>
					<h4 className='c-new-goal-form__section-heading'>
						Goal description
					</h4>
					<FormControl
						type='text'
						value={ this.state.goalDescription }
						onChange={ this.handleDescriptionChange }
						placeholder='Describe your goal...'
					/>
				</div>

				<hr className='c-new-goal-form__divider' />
				
				<div className='[ container ] c-new-goal-form__section'>
					<h4 className='c-new-goal-form__section-heading'>
						Due date
					</h4>
					<p className='c-new-goal-form__section-sub-heading'>Optional</p>
					<DatePicker
						customInput={ <WideDatepicker /> }
						selected={ this.state.dueDate }
						onChange={ this.handleDateChange } 
						withPortal
					/>
				</div>

				<hr className='c-new-goal-form__divider' />
			</div>							
		)
	}
}

export default NewGoalInput;