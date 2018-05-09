/////////////////////////////////////////
/// Package imports

import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import { withRouter, Redirect } from 'react-router-dom';

/////////////////////////////////////////
/// Dev Notes

	/*
	 * This component is has state in order to manage the task input and
	 * pass it back to the controller. Other state should be kept to a
	 * minimum.
	 */

/////////////////////////////////////////
/// Standard Components

import EditTaskInput from './EditTaskInput';
import HeaderBar from '../ux/HeaderBar';

/////////////////////////////////////////
/// Images & Styles

import '../../css/progress/EditTask.css';

/////////////////////////////////////////
/// Code

class EditTask extends React.Component {
	constructor (props) {
		super(props);

		const shouldRender = this.props.targetGoalId;
		let goalId;
		let taskId;
		let currTask;
		if (shouldRender) {
			goalId = this.props.targetGoalId;
			taskId = this.props.location.pathname.split(':id')[1];
			currTask = this.props.goals.filter((goal) => goal.id == goalId)[0]
				.tasks.filter((task) => task.id == taskId)[0];
		}

		this.state = {
			goalId: shouldRender ? goalId : '',
			taskId: shouldRender ? taskId : '',
			dueDate: shouldRender ? currTask.dueDate : '',
			goalTitle: shouldRender ? currTask.title : '',
			goalDescription: shouldRender ? currTask.description : '',
			shouldRender: shouldRender,
			currTask: currTask
		};

		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
	}

	goBack() {
		this.props.history.replace('/progress/goals/:id' + this.props.location.pathname.split(':id')[1]);
		this.props.history.goBack()
	}

	handleDateChange(date) {
		this.setState({
		  	dueDate: date
		});
	}		

	handleTitleChange(title) {
		this.setState({
			goalTitle: title
		});
	}

	handleDescriptionChange(description) {
		this.setState({
			goalDescription: description
		});
	}
	
	render() {
		return (
			this.state.shouldRender ?
			<div className='l-edit-task'>
				<HeaderBar 
					text={ 'Edit Task' }
				/>
				<div className='c-edit-task-form'>
					<form>
						<FormGroup
							controlId={ this.props.controlId ? this.props.controlId : 'editTaskForm' }
						>
							<EditTaskInput 
								handleDateChange={ (d) => this.handleDateChange(d) }
								handleTitleChange={ (t) => this.handleTitleChange(t) }
								handleDescriptionChange={ (d) => this.handleDescriptionChange(d) }
								task={ this.state.currTask }
							/>

							<div className='[ container ] c-edit-task-form__section'>
								<div className='c-edit-task-form__button-wrapper'>
									<Button className='c-edit-task-form__button--approve' onClick={ (e) => { this.props.updateTask(this.state.goalTitle, this.state.dueDate, this.state.goalDescription, this.state.goalId, this.state.taskId) } }>
										Save
									</Button>
									<Button className='c-edit-task-form__button--deny' onClick={ () => { this.goBack() } }>
										Cancel
									</Button>
								</div>
							</div>
						</FormGroup>
					</form>			
				</div>
			</div>
			: // ELSE
			<Redirect to='/progress/goals'></Redirect>
		)
	}
}

export default withRouter(EditTask);