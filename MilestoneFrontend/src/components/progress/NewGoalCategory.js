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
import NewGoalInput from './NewGoalInput';

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/NewGoalCategory.css';

/////////////////////////////////////////
/// Code

class NewGoalCategory extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			goalCategoryName: '',
			selectedProviders: []
		};
		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
	}

	componentWillMount() {
		this.props.refreshUser();
	}

	addGoalCategory() {
		let goalCategory = {
			UserID: this.props.currUser.id,
			Creator: this.props.currUser.id,
			Title: this.state.goalCategoryName,
			Category: "Education"
		}

		this.props.addGoalCategory(goalCategory);
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

	handleGoalCategoryNameChange(e) {
		this.setState({
			goalCategoryName: e.target.value
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
			<div className='l-new-goal-category'>
				<HeaderBar 
					text={ 'New Goal Category' }
				/>
				<div className='c-new-goal-category-form'>
					<form>
						<FormGroup
							controlId={ 'newGoalCategoryForm' }
						>
							<div className='[ container ] c-new-goal-category-form__section'>
								<h4 className='c-new-goal-category-form__section-heading'>
									Who would you like to work with?
								</h4>
								<ServiceProviderPicker 
									currUser={ this.props.currUser }
									handleServiceProviderSelection= { (i,s) => this.handleServiceProviderSelection(i,s) }
								/>
							</div>

							<hr className='c-new-goal-category-form__divider' />

							<div className='[ container ] c-new-goal-category-form__section'>
								<h4 className='c-new-goal-category-form__section-heading'>
									Goal category name
								</h4>
								<FormControl
									type='text'
									value={ this.state.goalCategoryName }
									placeholder='Type in your goal category...'
									onChange={ (e) => this.handleGoalCategoryNameChange(e) }
								/>
							</div>

							<hr className='c-new-goal-category-form__divider' />

							{/* <NewGoalInput 
								handleDateChange={ (d) => this.handleDateChange(d) }
								handleTitleChange={ (t) => this.handleTitleChange(t) }
								handleDescriptionChange={ (d) => this.handleDescriptionChange(d) }
							/> */}

							<div className='[ container ] c-new-goal-category-form__section'>
								<div className='c-new-goal-category-form__button-wrapper'>
									<Button className='c-new-goal-category-form__button--approve' onClick={ () => { this.addGoalCategory() } }>Save</Button>
									<Button className='c-new-goal-category-form__button--deny' onClick={ () => { this.props.history.replace('/Progress/Goals') } }>Cancel</Button>
								</div>
							</div>
						</FormGroup>
					</form>			
				</div>
			</div>
		)
	}
}

export default withRouter(NewGoalCategory);