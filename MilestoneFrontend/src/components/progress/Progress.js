/////////////////////////////////////////
/// Package imports

import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import Axios from 'axios';
/////////////////////////////////////////
/// Dev Notes

	/*
	 * 
	 */

/////////////////////////////////////////
/// Standard Components
import ProgressHeading from './ProgressHeading';
import Goals from './Goals';
import ProgressSearchResults from './ProgressSearchResults';
import UpcomingTasks from './UpcomingTasks';
import NewTask from './NewTask';
import EditTask from './EditTask';
import NewGoal from './NewGoal';
import EditGoal from './EditGoal';
import TaskExpandedComments from './TaskExpandedComments';
import TaskExpandedResources from './TaskExpandedResources';
import ParticipantList from './ParticipantList';
import ParticipantHeading from './ParticipantHeading';
import ResourceCategories from './ResourceCategories';
import ResourceCategory from './ResourceCategory';

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/Progress.css';

/////////////////////////////////////////
/// Code


// Progress.js is a display component that works in conjunction with ProgressController.js.
// ProgressController handles most of the state management, api calls and data manipulation, while
// the Progress component accepts the current state as props and routes data to the necessary components
// via ReactRouter based on the current URL, and the current user type (participant or service provider).
class Progress extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
			value: '',
			ResourceCategories: []
		};

		this.handleProviderSearch = this.handleProviderSearch.bind(this);
	}

	componentDidMount() {
	}

	// A helper function for determining which search to perform when logged in as a service provider.
	// Determines which search to perform based on URL parameters, then passes the given search parameter
	// as string up to the appropriate ProgressController function.
    handleProviderSearch(search) {
        if (this.props.location.pathname.includes("/provider")) {
			this.props.getConnections(search);
        } else if (this.props.location.pathname === "/progress/resources/categories") {
			this.props.getResources(search);
		} else {
			let url = this.props.location.pathname.length;
			let id = this.props.location.pathname.substring(31, url);
			let resourceCategory = this.props.resourceCategories.filter((category) => {
				return category.id === id
			})
			var resourceFilter;
			if (resourceCategory[0]) {
				resourceFilter = resourceCategory[0].resources.filter((resource) => {
					return resource.resourceName.toLowerCase().includes(search.toLowerCase().trim()) 
								|| resource.title.toLowerCase().includes(search.toLowerCase().trim())
				})
			}

			this.setState({
				filteredResources: resourceFilter,
			})
		}
	}

	render() {
		// To determine which Switch component to render.
		const isParticipant = this.props.isParticipant;
		const isServiceProvider = this.props.isServiceProvider;
		// A packaged ProgressHeading component with some props prefilled.
		const heading = (heading, navFilter, switchFunc) => 	<ProgressHeading
																	heading = { heading }
																	handleSearch={ (e) => this.props.handleSearch(e) }
																	navFilter={ navFilter }
																	switchFilter={ (e, t) => switchFunc(e, t) }
																	addBtnLink={ this.props.addBtnLink }
																/>

		// Finds the current participant being viewed's full name based on their stored userId.
		// Used if the current user is a service provider.
		let participantName = "";
		if (isServiceProvider) {
			if (this.props.participantUserId) {
				let participantNameFilter = this.props.connections.filter((connection) => connection.id === this.props.participantUserId);
				if (participantNameFilter.length > 0) {
					participantName = participantNameFilter[0].fullName;
				}
			}
		}

		// Progress.js renders one of two completely different Switches with different routes
		// dependent on whether the current user is a participant or service provider. While this
		// leads to some repeated code, this seperation of concerns leads to a better organization of
		// passed props, and a more secure cutoff of privileges from one user type to another.
		if(isParticipant !== null || isServiceProvider !== null) {
			if (isParticipant) { // If the user is a participant, render this switch.
				return (
					<div className='l-progress-content container'>
						<Switch>
							<Route exact path='/progress/goals/search' render={() => (
								<div>
									{ heading('Search Results', this.props.goalNavFilter, this.props.switchGoalNavFilter) }
									<ProgressSearchResults
										goals={ this.props.searchResults }
										navFilter={ this.props.goalNavFilter }
										refreshUser={() => this.props.refreshUser() }
										changeGoalFocus={ (e, goalId, goalTitle) => this.props.changeGoalFocus(e, goalId, goalTitle) }
									/>
								</div>
							)} />
							<Route exact path='/progress/goals/newtask/:id' render={() => (
								<div>
									<NewTask 
										addTask={ (title, date, description, targetCategoryId) => { this.props.addTask(title, date, description, targetCategoryId) }}
										targetGoalId = { this.props.targetGoalId }
									/>
								</div>
							)} />
							<Route exact path='/progress/goals/edittask/:id' render={() => (
								<div>
									<EditTask
										goals={ this.props.allGoals }
										targetGoalId = { this.props.targetGoalId }
										updateTask={ (title, date, description, targetGoalId, targetTaskId, goal) => this.props.updateTask(title, date, description, targetGoalId, targetTaskId, goal) }
									/>
								</div>
							)} />
							<Route exact path='/progress/goals/newgoal' render={() => (
								<div>
									<NewGoal
										currUser={ this.props.currUser }
										refreshUser={() => this.props.refreshUser() }
										addGoal={ (o) => this.props.addGoal(o) }
										isServiceProvider={ isServiceProvider }
									/>
								</div>
							)} />
							<Route exact path='/progress/goals/editgoal/:id' render={() => (
								<div>
									<EditGoal
										goals={ this.props.allGoals }
										currUser={ this.props.currUser }
										refreshUser={() => this.props.refreshUser() }
										editGoal={ (goal) => this.props.updateGoal(goal) }
										isServiceProvider={ isServiceProvider }
									/>
								</div>
							)} />
							<Route path='/progress/goals/comments/:id' render={() => (
								<div>
									<TaskExpandedComments
										currUser={ this.props.currUser }
										goals={ this.props.allGoals }
										submitComment={ (comment, taskId, goal) => this.props.submitComment(comment, taskId, goal) }
										editTask={ (taskId) => this.props.editTask(taskId) }
										markTaskComplete={ (taskId) => this.props.markTaskComplete(taskId) }
									/>
								</div>
							)} />
							<Route path='/progress/goals/resources/:id' render={() => (
								<div>
									<TaskExpandedResources
										currUser={ this.props.currUser }
										goals={ this.props.allGoals }
										submitResource={ (resourceName, resourceUrl, taskId, goal) => this.props.submitResource(resourceName, resourceUrl, taskId, goal) }
										editTask={ (taskId) => this.props.editTask(taskId) }
										markTaskComplete={ (taskId) => this.props.markTaskComplete(taskId) }
									/>
								</div>
							)} />
							<Route path='/progress/goals/:id' render={() => (
								<div>
									{/* { heading(this.props.heading, this.props.taskNavFilter, this.props.switchTaskNavFilter) } */}
									<UpcomingTasks
										heading={ (text) => heading(text, this.props.taskNavFilter, this.props.switchTaskNavFilter) }
										changeGoalFocus={ (e, goalId, goalTitle) => this.props.changeGoalFocus(e, goalId, goalTitle) }
										getSpecificGoal={ (goalId) => this.props.getSpecificGoal(goalId) }
										targetGoalId={ this.props.targetGoalId }
										goals={ this.props.allGoals }
										goalController={ this.props.goalController }
										navFilter={ this.props.taskNavFilter }
										refreshUser={() => this.props.refreshUser() }
										editTask={ (taskId) => this.props.editTask(taskId) }
										markTaskComplete={ (taskId, goal) => this.props.markTaskComplete(taskId, goal) }
										isParticipant={ isParticipant }
									/>
								</div>
							)} />
							<Route path='/progress/goals' render={() => (
								<div>
									{heading('Goals', this.props.goalNavFilter, this.props.switchGoalNavFilter)}
									<Goals
										currUser={ this.props.currUser }
										allGoals={ this.props.allGoals }
										navFilter={ this.props.goalNavFilter }
										goals={ this.props.allGoals }
										refreshUser={() => this.props.refreshUser() }
										changeGoalFocus = { (e, goalId, goalTitle) => this.props.changeGoalFocus(e, goalId, goalTitle) }
										markGoalActive={ (goalId) => this.props.markGoalActive(goalId) }
										markGoalComplete={ (goalId) => this.props.markGoalComplete(goalId) }
									/> 
								</div>
							)} />
							<Route path='/Progress' render={() => (
								<Redirect to='/progress/goals' />
							)} />
							<Route exact path='/progress' render={() => (
								<Redirect to='/progress/goals' />
							)} />
						</Switch>
					</div>
				);
	
			} else if (isServiceProvider) { // If the usser is a service provider, render this switch.
				return (
					<div className='l-progress-content container'>
						<Switch>
							<Route exact path='/progress/provider/participants' render={() => (
								<div>
									<ParticipantHeading 
										user={ this.props.user } 
										handleSearch={ (search) => this.handleProviderSearch(search) }
									/>
									<ParticipantList 
										currUser={ this.props.currUser }
										connections={ this.props.connections }
										getCurrentGoals={ (id) => this.props.getCurrentGoals(id) }
									/>
								</div>
							)} />
							<Route exact path='/progress/resources' render={() => (
								<Redirect to='/progress/resources/categories' />
							)} />
							<Route exact path='/progress/resources/categories' render={() => (
								<div>
									<ParticipantHeading 
										user={ this.props.user } 
										isResourceCategories={true}
										handleSearch={ (search) => this.handleProviderSearch(search) }
									/>
									<ResourceCategories 
										currUser={this.props.currUser} 
										resourceCategories={this.props.resourceCategories}
										getResources={(search) => this.props.getResources(search)}
										deleteResourceCategory={(id) => this.props.deleteResourceCategory(id)}
									/>
								</div>
							)} />
							
							<Route exact path='/progress/resources/categories/:id' render={() => (
								<div>
									<ParticipantHeading 
										user={ this.props.user } 
										isResources={true}
										handleSearch={ (search) => this.handleProviderSearch(search) }
									/>
									<ResourceCategory 
										goalController ={ this.props.goalController }
										resources = { this.state.filteredResources }
									/>
								</div>
							)} />
							<Route exact path='/progress/goals/search' render={() => (
								<div>
									{ heading('Search Results', this.props.goalNavFilter, this.props.switchGoalNavFilter) }
									<ProgressSearchResults
										goals={ this.props.searchResults }
										navFilter={ this.props.goalNavFilter }
										refreshUser={() => this.props.refreshUser() }
										changeGoalFocus={ (e, goalId, goalTitle) => this.props.changeGoalFocus(e, goalId, goalTitle) }
										isServiceProvider={ isServiceProvider }
									/>
								</div>
							)} />
							<Route exact path='/progress/goals/newtask/:id' render={() => (
								<div>
									<NewTask 
										addTask={ (title, date, description, targetCategoryId) => { this.props.addTask(title, date, description, targetCategoryId) }}
										targetGoalId = { this.props.targetGoalId }
									/>
								</div>
							)} />
							<Route exact path='/progress/goals/edittask/:id' render={() => (
								<div>
									<EditTask
										goals={ this.props.allGoals }
										targetGoalId = { this.props.targetGoalId }
										updateTask={ (title, date, description, targetGoalId, targetTaskId, goal) => this.props.updateTask(title, date, description, targetGoalId, targetTaskId, goal) }
									/>
								</div>
							)} />
							<Route exact path='/progress/goals/newgoal' render={() => (
								<div>
									<NewGoal
										currUser={ this.props.currUser }
										refreshUser={() => this.props.refreshUser() }
										addGoal={ (o) => this.props.addGoal(o) }
										isServiceProvider={ isServiceProvider }
									/>
								</div>
							)} />
							<Route exact path='/progress/goals/editgoal/:id' render={() => (
								<div>
									<EditGoal
										goals={ this.props.allGoals }
										currUser={ this.props.currUser }
										refreshUser={() => this.props.refreshUser() }
										editGoal={ (goal) => this.props.updateGoal(goal) }
										isServiceProvider={ isServiceProvider }
									/>
								</div>
							)} />
							<Route exact path='/progress/goals/comments/:id' render={() => (
								<div>
									<TaskExpandedComments
										currUser={ this.props.currUser }
										goals={ this.props.allGoals }
										submitComment={ (comment, taskId, goal) => this.props.submitComment(comment, taskId, goal) }
										editTask={ (taskId) => this.props.editTask(taskId) }
										markTaskComplete={ (taskId) => this.props.markTaskComplete(taskId) }
										markTaskActive={ (taskId) => this.props.markTaskActive(taskId) }
										isServiceProvider={ isServiceProvider }
									/>
								</div>
							)} />
							<Route exact path='/progress/goals/resources/:id' render={() => (
								<div>
									<TaskExpandedResources
										currUser={ this.props.currUser }
										goals={ this.props.allGoals }
										submitResource={ (resourceName, resourceUrl, taskId, goal) => this.props.submitResource(resourceName, resourceUrl, taskId, goal) }
										editTask={ (taskId) => this.props.editTask(taskId) }
										markTaskComplete={ (taskId) => this.props.markTaskComplete(taskId) }
									/>
								</div>
							)} />
							<Route exact path='/progress/provider/participants/goals/:id' render={() => (
								<div>
									{ heading(participantName, this.props.goalNavFilter, this.props.switchGoalNavFilter) }
									<Goals
										allGoals={ this.props.allGoals }
										currUser={ this.props.currUser }
										navFilter={ this.props.goalNavFilter }
										goals={ this.props.allGoals }
										getCurrentGoals={ this.props.getCurrentGoals }
										refreshUser={() => this.props.refreshUser() }
										changeGoalFocus = { (e, goalId, goalTitle) => this.props.changeGoalFocus(e, goalId, goalTitle) }
										markGoalActive={ (goalId) => this.props.markGoalActive(goalId) }
										markGoalComplete={ (goalId) => this.props.markGoalComplete(goalId) }
										isServiceProvider={ isServiceProvider }
									/> 
								</div>
							)} />
							<Route path='/progress/provider/participants/goals/tasks/:id' render={() => (
								<div>
									{/* { heading(this.props.heading, this.props.taskNavFilter, this.props.switchTaskNavFilter) } */}
									<UpcomingTasks
										heading={ (text) => heading(text, this.props.taskNavFilter, this.props.switchTaskNavFilter) }
										changeGoalFocus={ (e, goalId, goalTitle) => this.props.changeGoalFocus(e, goalId, goalTitle) }
										getSpecificGoal={ (goalId) => this.props.getSpecificGoal(goalId) }
										targetGoalId={ this.props.targetGoalId }
										goals={ this.props.allGoals }
										goalController={ this.props.goalController }
										getCurrentGoals={ this.props.getCurrentGoals }
										navFilter={ this.props.taskNavFilter }
										refreshUser={() => this.props.refreshUser() }
										editTask={ (taskId) => this.props.editTask(taskId) }
										markTaskActive={ (taskId, goal) => this.props.markTaskActive(taskId, goal) }
										markTaskComplete={ (taskId, goal) => this.props.markTaskComplete(taskId, goal) }
										isServiceProvider={ isServiceProvider }
										getConnections={ () => this.props.getConnections('') }
									/>
								</div>
							)} />
							<Route path='/Progress' render={() => (
								<Redirect to='/progress/provider/participants' />
							)} />
							<Route exact path='/progress' render={() => (
								<Redirect to='/progress/provider/participants' />
							)} />
						</Switch>
					</div>
				);
			}
		} else { // If something has gone wrong, render nothing for safety.
			return null;
		}
	}
}

export default withRouter(Progress);