/////////////////////////////////////////
/// Package imports

import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

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

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/EditGoal.css';

/////////////////////////////////////////
/// Code

// Handles functionality for editing an existing goal. Similar to NewGoal.js, 
// with some key differences.
class EditGoal extends React.Component {
	constructor (props) {
		super(props);

		let selectedProviders = [];
		if (props.isServiceProvider) {
			selectedProviders = [props.currUser.id];
		}
		this.state = {
			goalName: '',
			selectedProviders: selectedProviders
		};
		this.handleGoalNameChange = this.handleGoalNameChange.bind(this);
	}

	componentWillMount() {
		this.props.refreshUser();
	}

	componentWillReceiveProps(nextProps) {
		if (this.props !== nextProps) {
			let goalId = nextProps.location.pathname.split(':id')[1];
			var currGoal;
			for (let i = 0; i < nextProps.goals.length; i++) {
				if (nextProps.goals[i].id === goalId) {
					currGoal = nextProps.goals[i];
				}
			}
			if (currGoal) {
				this.setState({
					currGoal: currGoal,
					goalName: currGoal.title,
					selectedProviders: currGoal.serviceProviders
				});
			}
		}
	}

	// Retrieves the new Goal data from state, then passes it up to ProgressController
	// to be sent to the server.
	editGoal() {
		let goal = this.state.currGoal;
		goal.Title = this.state.goalName;
		goal.ServiceProviders = this.state.selectedProviders;

		this.props.editGoal(goal);
	}

	// Handles updating the component's state (and subsequently the UI) when selecting
	// or deselecting service provider's as a participant.
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

	// Handles updating the component's state with any changes made to the goal's title.
	handleGoalNameChange(e) {
		this.setState({
			goalName: e.target.value
		});
	}
	
	render() {
		return (
			<div className='l-new-goal'>
				<HeaderBar 
					text={ 'Edit Goal' }
				/>
				<div className='c-edit-goal-form'>
					<form>
						<FormGroup
							controlId={ 'editGoalForm' }
						>
							<div className="c-edit-goal-form-fields">
							
								{ !this.props.isServiceProvider ? (
								<div className='[ container ] c-edit-goal-form__section'>
									<h4 className='c-edit-goal-form__section-heading'>
										Who would you like to work with?
									</h4>
									<ServiceProviderPicker 
										currUser={ this.props.currUser }
										handleServiceProviderSelection= { (i,s) => this.handleServiceProviderSelection(i,s) }
										selectedProviders={ this.state.selectedProviders }
									/>
								</div>
								) : null }

								<hr className='c-edit-goal-form__divider' />

								<div className='[ container ] c-edit-goal-form__section'>
									<h4 className='c-edit-goal-form__section-heading'>
										Goal name
									</h4>
									<FormControl
										type='text'
										value={ this.state.goalName }
										placeholder='Type in your goal...'
										onChange={ (e) => this.handleGoalNameChange(e) }
									/>
								</div>

								<hr className='c-edit-goal-form__divider' />
							</div>
							<div className='[ container ] c-edit-goal-form__section'>
								<div className='c-edit-goal-form__button-wrapper'>
									<Button className='c-edit-goal-form__button--approve' onClick={ () => { this.editGoal() } }>Save</Button>
									<Button className='c-edit-goal-form__button--deny' onClick={ () => { this.props.history.replace('/progress/goals') } }>Cancel</Button>
								</div>
							</div>
						</FormGroup>
					</form>			
				</div>
			</div>
		)
	}
}

export default withRouter(EditGoal);