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

// import '../../css/progress/editGoal.css';

/////////////////////////////////////////
/// Code

class EditTaskInput extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			// startDate: this.props.task.dueDate,
			dueDate: this.props.task.dueDate === '0001-01-01T00:00:00Z' ? null : moment(this.props.task.dueDate),
			taskTitle: this.props.task.title,
			taskDescription: this.props.task.description,
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
			taskTitle: e.target.value
		});

		this.props.handleTitleChange(e.target.value);
	}	

	handleDescriptionChange(e) {
		this.setState({
			taskDescription: e.target.value
		});

		this.props.handleDescriptionChange(e.target.value);
	}
	
	render() {
		return (
			<div>
				<div className='[ container ] c-edit-goal-form__section'>
					<h4 className='c-edit-goal-form__section-heading'>
						New Goal name
					</h4>
					<FormControl
						type='text'
						value={ this.state.taskTitle }
						onChange={ this.handleTitleChange }
						placeholder='Type in your goal...'
					/>
				</div>

				<hr className='c-edit-goal-form__divider' />

				<div className='[ container ] c-edit-goal-form__section'>
					<h4 className='c-edit-goal-form__section-heading'>
						New Goal description
					</h4>
					<FormControl
						type='text'
						value={ this.state.taskDescription }
						onChange={ this.handleDescriptionChange }
						placeholder='Describe your goal...'
					/>
				</div>

				<hr className='c-edit-goal-form__divider' />
				
				<div className='[ container ] c-edit-goal-form__section'>
					<h4 className='c-edit-goal-form__section-heading'>
						New Due date
					</h4>
					<p className='c-edit-goal-form__section-sub-heading'>Optional</p>
					<DatePicker
						customInput={ <WideDatepicker /> }
						selected={ this.state.dueDate }
						onChange={ this.handleDateChange }
						withPortal
					/>
				</div>

				<hr className='c-edit-goal-form__divider' />
			</div>							
		)
	}
}

export default EditTaskInput;