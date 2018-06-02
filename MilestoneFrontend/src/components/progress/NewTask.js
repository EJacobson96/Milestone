/////////////////////////////////////////
/// Package imports

import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Dev Notes

	/*
	 * This component is has state in order to manage the goal input and
	 * pass it back to the controller. Other state should be kept to a
	 * minimum.
	 */

/////////////////////////////////////////
/// Standard Components

import NewTaskInput from './NewTaskInput';
import HeaderBar from '../ux/HeaderBar';

/////////////////////////////////////////
/// Images & Styles

import '../../css/progress/NewTask.css';

/////////////////////////////////////////
/// Code

// A component for the creation of a new task attached to a participant's existing goal.
class NewTask extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			dueDate: '',
			taskTitle: '',
			taskDescription: ''
		};

		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
	}

	// A helper method for when the user selects the 'cancel' button. Replaces the current page
	// in the user's browser history then navigates back one page, to ensure that if a user
	// then goes back once more it will not return to this component and appear to paradoxically
	// go 'forward'.
	goBack() {
		this.props.history.replace('/progress/goals/:id' + this.props.location.pathname.split(':id')[1]);
		this.props.history.goBack()
	}

	// Handles setting the component's state on the user selecting a due date for the task.
	// Works in conjunction with the NewTaskInput component.
	handleDateChange(date) {
		this.setState({
		  	dueDate: date
		});
	}		

	// Handles setting the component's state on the user changing the title of the new task.
	// Works in conjunction with the NewTaskInput component.
	handleTitleChange(title) {
		this.setState({
			taskTitle: title
		});
	}

	// Handles settings the component's state on the user changing the description of the new
	// task. Works in conjunction with the NewTaskInput component.
	handleDescriptionChange(description) {
		this.setState({
			taskDescription: description
		});
	}
	
	render() {
		var goalId = this.props.targetGoalId;
		if (!goalId) {
			goalId = this.props.location.pathname.split(':id')[1];
		}
		return (
			<div className='l-new-goal'>
				<HeaderBar 
					text={ 'New Task' }
				/>
				<div className='c-new-task-form'>
					<form>
						<FormGroup
							controlId={ this.props.controlId ? this.props.controlId : 'newTaskForm' }
						>
							<NewTaskInput 
								handleDateChange={ (d) => this.handleDateChange(d) }
								handleTitleChange={ (t) => this.handleTitleChange(t) }
								handleDescriptionChange={ (d) => this.handleDescriptionChange(d) }
							/>

							<div className='[ container ] c-new-task-form__section'>
								<div className='c-new-task-form__button-wrapper'>
									<Button className='c-new-task-form__button--approve' onClick={ (e) => { this.props.addTask(this.state.taskTitle, this.state.dueDate, this.state.taskDescription, goalId) } }>
										Save
									</Button>
									<Button className='c-new-task-form__button--deny' onClick={ () => { this.goBack() } }>
										Cancel
									</Button>
				              	</div>
							</div>
						</FormGroup>
					</form>			
				</div>
			</div>
		)
	}
}

export default withRouter(NewTask);