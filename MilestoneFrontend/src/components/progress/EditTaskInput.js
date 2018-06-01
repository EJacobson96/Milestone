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

/////////////////////////////////////////
/// Code

// A collection of input fields specifically made for editing an existing task. Works
// as a sub-component of EditTask.js.
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

	// Handles the date being changed by DatePicker component. Updates this component's state,
	// and passes the new date up to a parent component. 
	handleDateChange(date) {
		this.setState({
		  	dueDate: date
		});

		this.props.handleDateChange(date);
	}	

	// Handles the task title being changed. Updates this component's state,
	// and passes the new date up to a parent component. 
	handleTitleChange(e) {
		this.setState({
			taskTitle: e.target.value
		});

		this.props.handleTitleChange(e.target.value);
	}	
	
	// Handles the task description being changed by DatePicker component. Updates this component's state,
	// and passes the new date up to a parent component. 
	handleDescriptionChange(e) {
		this.setState({
			taskDescription: e.target.value
		});

		this.props.handleDescriptionChange(e.target.value);
	}
	
	render() {
		return (
			<div>
				<div className='[ container ] c-edit-task-form__section'>
					<h4 className='c-edit-task-form__section-heading'>
						New Task name
					</h4>
					<FormControl
						type='text'
						value={ this.state.taskTitle }
						onChange={ this.handleTitleChange }
						placeholder='Type in your task...'
					/>
				</div>

				<hr className='c-edit-task-form__divider' />

				<div className='[ container ] c-edit-task-form__section'>
					<h4 className='c-edit-task-form__section-heading'>
						New Task description
					</h4>
					<FormControl
						type='text'
						value={ this.state.taskDescription }
						onChange={ this.handleDescriptionChange }
						placeholder='Describe your task...'
					/>
				</div>

				<hr className='c-edit-task-form__divider' />
				
				<div className='[ container ] c-edit-task-form__section'>
					<h4 className='c-edit-task-form__section-heading'>
						New Due date
					</h4>
					<p className='c-edit-task-form__section-sub-heading'>Optional</p>
					<DatePicker
						customInput={ <WideDatepicker /> }
						selected={ this.state.dueDate }
						onChange={ this.handleDateChange }
						withPortal
					/>
				</div>

				<hr className='c-edit-task-form__divider' />
			</div>							
		)
	}
}

export default EditTaskInput;