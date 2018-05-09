/////////////////////////////////////////
/// Package imports

import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Axios from 'axios';
import moment from 'moment';

/////////////////////////////////////////
/// Dev Notes

	/*
	 * This component has state in order to manage the goal inputs and to
	 * add and keep track of initial goals to pass back to the controller. 
	 * Other state should be kept to a minimum.
	 */

/////////////////////////////////////////
/// Standard Components

import HeaderBar from '../ux/HeaderBar';
import ServiceProviderPicker from './ServiceProviderPicker';
import NewTaskInput from './NewTaskInput';

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/NewGoal.css';

/////////////////////////////////////////
/// Code

class NewGoal extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			goalName: '',
			selectedProviders: []
		};
		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
	}

	componentWillMount() {
		this.props.refreshUser();
	}

	addGoal() {
		let goal = {
			UserID: this.props.currUser.id,
			Creator: this.props.currUser.id,
			Title: this.state.goalName,
			Category: "Education",
			ServiceProviders: this.state.selectedProviders
		}

		this.props.addGoal(goal);
	}

	handleServiceProviderSelection(id, selected) {
		let newArray = this.state.selectedProviders;
		if (selected) {
			newArray.push(id);
			this.setState({
				selectedProviders: newArray
			});
		} else {
			let index = newArray.indexOf('id');
			newArray.splice(index, 1);
			this.setState({
				selectedProviders: newArray
			});
		}
	}

	handleGoalNameChange(e) {
		this.setState({
			goalName: e.target.value
		});
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
									Who would you like to work with?
								</h4>
								<ServiceProviderPicker 
									currUser={ this.props.currUser }
									handleServiceProviderSelection= { (i,s) => this.handleServiceProviderSelection(i,s) }
								/>
							</div>

							<hr className='c-new-goal-form__divider' />

							<div className='[ container ] c-new-goal-form__section'>
								<h4 className='c-new-goal-form__section-heading'>
									Goal name
								</h4>
								<FormControl
									type='text'
									value={ this.state.goalName }
									placeholder='Type in your goal...'
									onChange={ (e) => this.handleGoalNameChange(e) }
								/>
							</div>

							<hr className='c-new-goal-form__divider' />

							{/* <NewGoalInput 
								handleDateChange={ (d) => this.handleDateChange(d) }
								handleTitleChange={ (t) => this.handleTitleChange(t) }
								handleDescriptionChange={ (d) => this.handleDescriptionChange(d) }
							/> */}

							<div className='[ container ] c-new-goal-form__section'>
								<div className='c-new-goal-form__button-wrapper'>
									<Button className='c-new-goal-form__button--approve' onClick={ () => { this.addGoal() } }>Save</Button>
									<Button className='c-new-goal-form__button--deny' onClick={ () => { this.props.history.replace('/progress/goals') } }>Cancel</Button>
								</div>
							</div>
						</FormGroup>
					</form>			
				</div>
			</div>
		)
	}
}

export default withRouter(NewGoal);