/////////////////////////////////////////
/// Package imports

import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Glyphicon, Button } from 'react-bootstrap';

/////////////////////////////////////////
/// Dev Notes

	/*
	 * This component has state in order to manage the task inputs and to
	 * add and keep track of initial task to pass back to the controller. 
	 * Other state should be kept to a minimum.
	 */

/////////////////////////////////////////
/// Standard Components


/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/TaskResources.css';
import fakeuser from '../../img/fakeuser.png';

/////////////////////////////////////////
/// Code

class TaskResources extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			resourceTitle: "",
			resourceUrl: "",
			showAddResourceInput: false
		};
		this.handleResourceTitleChange = this.handleResourceTitleChange.bind(this);
		this.handleResourceUrlChange = this.handleResourceUrlChange.bind(this);
	}

	componentWillMount() {
		// this.props.refreshUser();
	}

	handleResourceTitleChange(e) {
		this.setState({
			resourceTitle: e.target.value
		});
	}

	handleResourceUrlChange(e) {
		this.setState({
			resourceUrl: e.target.value
		});
	}

	handleResourceSubmit(e) {
		if (e) {
			e.preventDefault();
		}
		if (this.state.resourceTitle !== "" && this.state.resourceUrl !== "") {
			let resourceUrl = this.state.resourceUrl;
			if (!resourceUrl.startsWith("http://")) {
				resourceUrl = "http://" + resourceUrl;
			}
			this.props.submitResource(this.state.resourceTitle, resourceUrl, this.props.taskId);
		}
		this.setState({
			resourceTitle: "",
			resourceUrl: ""
		});
		this.toggleAddResourceInput();
	}

	toggleAddResourceInput() {
		const toggle = !this.state.showAddResourceInput;
		this.setState({
			showAddResourceInput: toggle
		});
	}
	
	render() {
		let resources = "";
		if (this.props.task.resources) {
			if (this.props.task.resources.length > 0) {
				resources = this.props.task.resources.map((resource) => {
					return (
						<div className='c-task-resources__resource'>
							<div className='c-task-resources__resource__text-flex-box'>
								<a href={ resource.url } className='c-task-resources__resource__text'>{ resource.title }</a>
							</div>
						</div>
					)
				});
			}
		}
		return (
			<div className={ 'c-task-resources' } id={ 'resource-id-' + this.props.taskId }>

				{ resources }
				
				{ this.state.showAddResourceInput &&
				<div className='c-task-resources__input-wrapper'>
					<div className='[ container ] c-task-resources__input-flex-block'>
						<form onSubmit={ (e) => this.handleResourceSubmit(e) }>
							<FormGroup
								controlId="taskResourceInput"
								// validationState={this.getValidationState()}
								className='c-task-resources__form-group'
							>
								<div className="input-group c-task-resources__input-inner-block">
									<FormControl
										type="text"
										value={ this.state.resourceTitle }
										placeholder="Resource Name"
										onChange={ (e) => this.handleResourceTitleChange(e) }
										className='c-task-resources__input c-task-resources__input--resource-title-input'
										autoComplete='off'
									/>
									<FormControl
										type="text"
										value={ this.state.resourceUrl }
										placeholder="Resource URL"
										onChange={ (e) => this.handleResourceUrlChange(e) }
										className='c-task-resources__input c-task-resources__input--resource-url-input'
										autoComplete='off'
									/>
									<Button className='c-task-resources__save-resource-btn' onClick={ () => this.handleResourceSubmit() }>
										Save Resource
									</Button>
								</div>							
								<FormControl.Feedback />
							</FormGroup>
						</form>
					</div>
				</div> }
				{ !this.state.showAddResourceInput &&
				<div className='c-task-resources__toggle-input-btn-flex-wrapper'>
					<Button className='c-task-resources__toggle-input-btn' onClick={ () => this.toggleAddResourceInput() }>
						<Glyphicon glyph="plus" /> Add a resource
					</Button> 
				</div> }
			</div>			
		)
	}
}

export default TaskResources;