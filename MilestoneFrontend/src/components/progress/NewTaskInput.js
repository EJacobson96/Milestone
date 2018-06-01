/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';

	/*
	 * This component is has state in order to manage the task input,
	 * validate the input, manage the datepicker and  pass data back to the controller. 
	 * Other state should be kept to a minimum.
	 */

/////////////////////////////////////////
/// Standard Components

import WideDatepicker from './WideDatepicker';

/////////////////////////////////////////
/// Images & Styles

// import '../../css/progress/NewGoal.css';

/////////////////////////////////////////
/// Code

// A specialized input component for the creation of a new task. A sub-component of
// NewTask.js. 
class NewTaskInput extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			startDate: moment(),
			taskTitle: '',
			taskDescription: ''
		};
		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
	}

	// Handles the management of data when a user changes the new task's due date. Stores
	// the new date in this component's state and passes the new date to the parent
	// NewTask component.
	handleDateChange(date) {
		this.setState({
		  	dueDate: date
		});

		this.props.handleDateChange(date);
	}	

	// Handles the management of data when a user changes the new task's title. Stores
	// the new date in this component's state and passes the new title to the parent
	// NewTask component.
	handleTitleChange(e) {
		this.setState({
			taskTitle: e.target.value
		});

		this.props.handleTitleChange(e.target.value);
	}	

	// Handles the management of data when a user changes the new task's description. Stores
	// the new date in this component's state and passes the new description to the parent
	// NewTask component.
	handleDescriptionChange(e) {
		this.setState({
			taskDescription: e.target.value
		});

		this.props.handleDescriptionChange(e.target.value);
	}
	
	render() {
		return (
			<div className="c-new-task-form-fields">
				<div className='[ container ] c-new-task-form__section'>
					<h4 className='c-new-task-form__section-heading'>
						Task name
					</h4>
					<FormControl
						type='text'
						value={ this.state.taskTitle }
						onChange={ this.handleTitleChange }
						placeholder='Type in your task...'
					/>
				</div>

				<hr className='c-new-task-form__divider' />

				<div className='[ container ] c-new-task-form__section'>
					<h4 className='c-new-task-form__section-heading'>
						Task description
					</h4>
					<FormControl
						type='text'
						value={ this.state.taskDescription }
						onChange={ this.handleDescriptionChange }
						placeholder='Describe your task...'
					/>
				</div>

				<hr className='c-new-task-form__divider' />
				
				<div className='[ container ] c-new-task-form__section'>
					<h4 className='c-new-task-form__section-heading'>
						Due date
					</h4>
					<p className='c-new-task-form__section-sub-heading'>Optional</p>
					<DatePicker
						customInput={ <WideDatepicker /> }
						selected={ this.state.dueDate }
						onChange={ this.handleDateChange } 
						withPortal
					/>
				</div>

				<hr className='c-new-task-form__divider' />
			</div>							
		)
	}
}

export default NewTaskInput;