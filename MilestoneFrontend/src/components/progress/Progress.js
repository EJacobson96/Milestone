/////////////////////////////////////////
/// Package imports

import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

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

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/Progress.css';

/////////////////////////////////////////
/// Code

const Progress = (props) => {
	const heading = (heading, navFilter, switchFunc) => 	<ProgressHeading
										heading = { heading }
										handleSearch={ (e) => props.handleSearch(e) }
										navFilter={ navFilter }
										switchFilter={ (e, t) => switchFunc(e, t) }
										addBtnLink={ props.addBtnLink }
									/>

	return (
		<div className='l-progress-content'>
			<Switch>
				<Route path='/progress/goals/search' render={() => (
					<div>
						{ heading('Search Results', props.goalNavFilter, props.switchGoalNavFilter) }
						<ProgressSearchResults
							goals={ props.searchResults }
							navFilter={ props.goalNavFilter }
							refreshUser={() => props.refreshUser() }
							changeGoalFocus={ (e, goalId, goalTitle) => props.changeGoalFocus(e, goalId, goalTitle) }
						/>
					</div>
				)} />
				<Route path='/progress/goals/newtask/:id' render={() => (
					<div>
						<NewTask 
							addTask={ (title, date, description, targetCategoryId) => { props.addTask(title, date, description, targetCategoryId) }}
							targetGoalId = { props.targetGoalId }
						/>
					</div>
				)} />
				<Route path='/progress/goals/edittask/:id' render={() => (
					<div>
						<EditTask
							updateTask={ (title, date, description, targetCategoryId) => { props.updateTask(title, date, description, targetCategoryId) }}
							goals={ props.goals }
							targetGoalId = { props.targetGoalId }
							updateTask={ (title, date, description, targetGoalId, targetTaskId) => props.updateTask(title, date, description, targetGoalId, targetTaskId) }
						/>
					</div>
				)} />
				<Route path='/progress/goals/newgoal' render={() => (
					<div>
						<NewGoal
							currUser={ props.currUser }
							refreshUser={() => props.refreshUser() }
							addGoal={ (o) => props.addGoal(o) }
						/>
					</div>
				)} />
				<Route path='/progress/goals/comments/:id' render={() => (
					<div>
						<TaskExpandedComments
							currUser={ props.currUser }
							goals={ props.goals }
							submitComment={ (comment, taskId) => props.submitComment(comment, taskId) }
							editTask={ (taskId) => props.editTask(taskId) }
							markTaskComplete={ (taskId) => props.markTaskComplete(taskId) }
						/>
					</div>
				)} />
				<Route path='/progress/goals/:id' render={() => (
					<div>
						{ heading(props.heading, props.taskNavFilter, props.switchTaskNavFilter) }
						<UpcomingTasks
							targetGoalId={ props.targetGoalId }
							goals={ props.goals }
							navFilter={ props.taskNavFilter }
							refreshUser={() => props.refreshUser() }
							editTask={ (taskId) => props.editTask(taskId) }
							markTaskComplete={ (taskId) => props.markTaskComplete(taskId) }
						/>
					</div>
				)} />
				<Route exact path='/progress/goals' render={() => (
					<div>
						{ heading('Goals', props.goalNavFilter, props.switchGoalNavFilter) }
						<Goals
							goals={ props.goals }
							refreshUser={() => props.refreshUser() }
							changeGoalFocus = { (e, goalId, goalTitle) => props.changeGoalFocus(e, goalId, goalTitle) }
						/>
					</div>
				)} />
				<Route path='/Progress' render={(props) => (
					<Redirect to='/progress/goals' />
				)} />
				<Route exact path='/progress' render={(props) => (
					<Redirect to='/progress/goals' />
				)} />
			</Switch>
		</div>
	)
}

export default Progress;