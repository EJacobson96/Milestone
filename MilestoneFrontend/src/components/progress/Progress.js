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

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/Progress.css';

/////////////////////////////////////////
/// Code


class Progress extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: ''
		};

		this.handleProviderSearch = this.handleProviderSearch.bind(this);
	}

    handleProviderSearch(search) {
        if (this.props.location.pathname.includes("/provider")) {
			this.props.getConnections(search);
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

		let participantHeader;
		let participantName = "";
		if (isServiceProvider) {
			participantHeader = <ParticipantHeading 
									user={ this.props.user } 
									handleSearch={ (search) => this.handleProviderSearch(search) }
								/>
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
										targetGoalId={ this.props.targetGoalId }
										goals={ this.props.goals }
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
	
			} else if(isServiceProvider) { // User is Service Provider

				return (
					<div className='l-progress-content container'>
						<Switch>
							<Route exact path='/progress/provider/participants' render={() => (
								<div>
									{ participantHeader }
									<ParticipantList 
										connections={ this.props.connections }
										getCurrentGoals={ (id) => this.props.getCurrentGoals(id) }
									/>
								</div>
							)} />
							<Route exact path='/progress/resources' render={() => (
								<div>
									{participantHeader}
									{/* <ParticipantList 
										connections={ this.state.connections }
									/> */}
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
										refreshUser={() => this.props.refreshUser() }
										changeGoalFocus = { (e, goalId, goalTitle) => this.props.changeGoalFocus(e, goalId, goalTitle) }
									/> 
								</div>
							)} />
							<Route path='/progress/provider/participants/goals/tasks/:goalid' render={() => (
								<div>
									{ heading(this.props.heading, this.props.taskNavFilter, this.props.switchTaskNavFilter) }
									<UpcomingTasks
										targetGoalId={ this.props.targetGoalId }
										goals={ this.props.goals }
										navFilter={ this.props.taskNavFilter }
										refreshUser={() => this.props.refreshUser() }
										editTask={ (taskId) => this.props.editTask(taskId) }
										markTaskComplete={ (taskId) => this.props.markTaskComplete(taskId) }
									/>
								</div>
							)} />
							{/* <Route path='/progress/goals/:id' render={() => (
								<Redirect to={ '/progress/provider/participants/goals/tasks/:goalid' + this.props.participantUserId } />
							)} /> */}
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