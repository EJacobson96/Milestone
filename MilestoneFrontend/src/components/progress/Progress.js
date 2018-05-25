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
			console.log(resourceCategory);
			var resourceFilter;
			if (resourceCategory[0]) {
				resourceFilter = resourceCategory[0].resources.filter((resource) => {
					return resource.resourceName.toLowerCase().includes(search.toLowerCase().trim()) 
								|| resource.title.toLowerCase().includes(search.toLowerCase().trim())
				})
			}

			console.log(resourceFilter);
			this.setState({
				filteredResources: resourceFilter,
			})
		}
	}

	render() {
		const isParticipant = this.props.isParticipant;
		const isServiceProvider = this.props.isServiceProvider;
		const heading = (heading, navFilter, switchFunc) => 	<ProgressHeading
																	heading = { heading }
																	handleSearch={ (e) => this.props.handleSearch(e) }
																	navFilter={ navFilter }
																	switchFilter={ (e, t) => switchFunc(e, t) }
																	addBtnLink={ this.props.addBtnLink }
																/>

		let participantName = "";
		if (isServiceProvider) {
			if (this.props.participantUserId) {
				let participantNameFilter = this.props.connections.filter((connection) => connection.id === this.props.participantUserId);
				if (participantNameFilter.length > 0) {
					participantName = participantNameFilter[0].fullName;
				}
			}
		}

		if(isParticipant !== null || isServiceProvider !== null) {
			if (isParticipant) {
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
										updateTask={ (title, date, description, targetCategoryId) => { this.props.updateTask(title, date, description, targetCategoryId) }}
										goals={ this.props.goals }
										targetGoalId = { this.props.targetGoalId }
										updateTask={ (title, date, description, targetGoalId, targetTaskId) => this.props.updateTask(title, date, description, targetGoalId, targetTaskId) }
									/>
								</div>
							)} />
							<Route exact path='/progress/goals/newgoal' render={() => (
								<div>
									<NewGoal
										currUser={ this.props.currUser }
										refreshUser={() => this.props.refreshUser() }
										addGoal={ (o) => this.props.addGoal(o) }
									/>
								</div>
							)} />
							<Route path='/progress/goals/comments/:id' render={() => (
								<div>
									<TaskExpandedComments
										currUser={ this.props.currUser }
										goals={ this.props.goals }
										submitComment={ (comment, taskId) => this.props.submitComment(comment, taskId) }
										editTask={ (taskId) => this.props.editTask(taskId) }
										markTaskComplete={ (taskId) => this.props.markTaskComplete(taskId) }
									/>
								</div>
							)} />
							<Route path='/progress/goals/resources/:id' render={() => (
								<div>
									<TaskExpandedResources
										currUser={ this.props.currUser }
										goals={ this.props.goals }
										submitResource={ (resourceName, resourceUrl, taskId) => this.props.submitResource(resourceName, resourceUrl, taskId) }
										editTask={ (taskId) => this.props.editTask(taskId) }
										markTaskComplete={ (taskId) => this.props.markTaskComplete(taskId) }
									/>
								</div>
							)} />
							<Route path='/progress/goals/:id' render={() => (
								<div>
									{ heading(this.props.heading, this.props.taskNavFilter, this.props.switchTaskNavFilter) }
									<UpcomingTasks
										changeGoalFocus={ (e, goalId, goalTitle) => this.props.changeGoalFocus(e, goalId, goalTitle) }
										targetGoalId={ this.props.targetGoalId }
										goals={ this.props.goals }
										goalController={ this.props.goalController }
										navFilter={ this.props.taskNavFilter }
										refreshUser={() => this.props.refreshUser() }
										editTask={ (taskId) => this.props.editTask(taskId) }
										markTaskComplete={ (taskId) => this.props.markTaskComplete(taskId) }
									/>
								</div>
							)} />
							<Route path='/progress/goals' render={() => (
								<div>
									{heading('Goals', this.props.goalNavFilter, this.props.switchGoalNavFilter)}
									<Goals
										goals={ this.props.goals }
										refreshUser={() => this.props.refreshUser() }
										changeGoalFocus = { (e, goalId, goalTitle) => this.props.changeGoalFocus(e, goalId, goalTitle) }
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
	
			} else if (isServiceProvider) { // User is Service Provider
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
										updateTask={ (title, date, description, targetCategoryId) => { this.props.updateTask(title, date, description, targetCategoryId) }}
										goals={ this.props.goals }
										targetGoalId = { this.props.targetGoalId }
										updateTask={ (title, date, description, targetGoalId, targetTaskId) => this.props.updateTask(title, date, description, targetGoalId, targetTaskId) }
									/>
								</div>
							)} />
							<Route exact path='/progress/goals/newgoal' render={() => (
								<div>
									<NewGoal
										currUser={ this.props.currUser }
										refreshUser={() => this.props.refreshUser() }
										addGoal={ (o) => this.props.addGoal(o) }
									/>
								</div>
							)} />
							<Route exact path='/progress/goals/comments/:id' render={() => (
								<div>
									<TaskExpandedComments
										currUser={ this.props.currUser }
										goals={ this.props.goals }
										submitComment={ (comment, taskId) => this.props.submitComment(comment, taskId) }
										editTask={ (taskId) => this.props.editTask(taskId) }
										markTaskComplete={ (taskId) => this.props.markTaskComplete(taskId) }
									/>
								</div>
							)} />
							<Route exact path='/progress/goals/resources/:id' render={() => (
								<div>
									<TaskExpandedResources
										currUser={ this.props.currUser }
										goals={ this.props.goals }
										submitResource={ (resourceName, resourceUrl, taskId) => this.props.submitResource(resourceName, resourceUrl, taskId) }
										editTask={ (taskId) => this.props.editTask(taskId) }
										markTaskComplete={ (taskId) => this.props.markTaskComplete(taskId) }
									/>
								</div>
							)} />
							<Route exact path='/progress/provider/participants/goals/:id' render={() => (
								<div>
									{ heading(participantName, this.props.goalNavFilter, this.props.switchGoalNavFilter) }
									<Goals
										goals={ this.props.goals }
										getCurrentGoals={ this.props.getCurrentGoals }
										refreshUser={() => this.props.refreshUser() }
										changeGoalFocus = { (e, goalId, goalTitle) => this.props.changeGoalFocus(e, goalId, goalTitle) }
									/> 
								</div>
							)} />
							<Route path='/progress/provider/participants/goals/tasks/:id' render={() => (
								<div>
									{ heading(this.props.heading, this.props.taskNavFilter, this.props.switchTaskNavFilter) }
									<UpcomingTasks
										changeGoalFocus={ (e, goalId, goalTitle) => this.props.changeGoalFocus(e, goalId, goalTitle) }
										targetGoalId={ this.props.targetGoalId }
										goals={ this.props.goals }
										goalController={ this.props.goalController }
										getCurrentGoals={ this.props.getCurrentGoals }
										navFilter={ this.props.taskNavFilter }
										refreshUser={() => this.props.refreshUser() }
										editTask={ (taskId) => this.props.editTask(taskId) }
										markTaskComplete={ (taskId) => this.props.markTaskComplete(taskId) }
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
		} else {
			return null;
		}
	}
}

export default withRouter(Progress);