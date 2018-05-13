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