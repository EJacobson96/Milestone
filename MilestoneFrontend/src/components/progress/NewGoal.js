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

import NewGoalInput from './NewGoalInput';
import HeaderBar from '../ux/HeaderBar';

/////////////////////////////////////////
/// Images & Styles

import '../../css/progress/NewGoal.css';

/////////////////////////////////////////
/// Code

class NewGoal extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			dueDate: '',
			goalTitle: '',
			goalDescription: ''
		};

		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
	}

	goBack() {
		this.props.history.replace('/Progress/Goals/:id' + this.props.location.pathname.split(':id')[1]);
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
		var catId = this.props.targetGoalCategoryId;
		if (!catId) {
			catId = this.props.location.pathname.split(':id')[1];
		}
		return (
			<div className='l-new-goal'>
				<HeaderBar 
					text={ 'New Goal' }
				/>
				<div className='c-new-goal-form'>
					<form>
						<FormGroup
							controlId={ this.props.controlId ? this.props.controlId : 'newGoalForm' }
						>
							<NewGoalInput 
								handleDateChange={ (d) => this.handleDateChange(d) }
								handleTitleChange={ (t) => this.handleTitleChange(t) }
								handleDescriptionChange={ (d) => this.handleDescriptionChange(d) }
							/>

							<div className='[ container ] c-new-goal-form__section'>
								<div className='c-new-goal-form__button-wrapper'>
									<Button className='c-new-goal-form__button--approve' onClick={ (e) => { this.props.addGoal(this.state.goalTitle, this.state.dueDate, this.state.goalDescription, catId) } }>
										Save
									</Button>
									<Button className='c-new-goal-form__button--deny' onClick={ () => { this.goBack() } }>
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

export default withRouter(NewGoal);