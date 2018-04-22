/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Axios from 'axios';
import moment from 'moment';

/////////////////////////////////////////
/// Standard Components

import HeaderBar from '../ux/HeaderBar';
import WideDatepicker from './WideDatepicker';

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/NewGoalCategory.css';

/////////////////////////////////////////
/// Code

class NewGoalCategory extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			startDate: moment()
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(date) {
		this.setState({
		  startDate: date
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
							controlId={ 'newGoalForm' }
						>
							<div className='[ container ] c-new-goal-category-form__section'>
								<h4 className='c-new-goal-category-form__section-heading'>
									Goal category name
								</h4>
								<FormControl
									type='text'
									placeholder='Type in your goal category...'
								/>
							</div>

							<hr className='c-new-goal-category-form__divider' />
							
							<div className='[ container ] c-new-goal-category-form__section'>
								<h4 className='c-new-goal-category-form__section-heading'>
									Due date
								</h4>
								<p className='c-new-goal-category-form__section-sub-heading'>Optional</p>
								<DatePicker
									customInput={ <WideDatepicker /> }
									selected={this.state.startDate}
									onChange={ this.handleChange } 
									withPortal
								/>
							</div>

							<hr className='c-new-goal-category-form__divider' />

							<div className='[ container ] c-new-goal-category-form__section'>
							<div className='c-new-goal-category-form__button-wrapper'>
					            <Button className='c-new-goal-category-form__button--approve' onClick={ () => {  } }>Save</Button>
					            <Button className='c-new-goal-category-form__button--deny' onClick={ () => {  } }>Cancel</Button>
				              </div>
							</div>
						</FormGroup>
					</form>			
				</div>
			</div>
		)
	}
}

export default NewGoalCategory;