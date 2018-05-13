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

		this.handleSearch = this.handleSearch.bind(this);
	}

	componentDidMount() {
		this.setConnections('');
	}

	componentWillReceiveProps() {
		this.setConnections('');
	}

    handleSearch(search) {
        if (this.props.location.pathname.includes("/people")) {
			this.setConnections(search);
        } else {

        }
	}
	
	setConnections(search) {
		console.log(this.props);
		Axios.get(
			'https://milestoneapi.eric-jacobson.me/connections?q=' + search + "&id=" + this.props.user.id,
			{
				headers: {
					'Authorization': localStorage.getItem('Authorization')
				}
			})
			.then(response => {
				return response.data;
			})
			.then(data => {
				console.log(data);
				this.setState({
					connections: data
				})
			})
			.catch(error => {
				console.log(error);
			});
	}

	render() {
		const heading = (heading, navFilter, switchFunc) => 	<ProgressHeading
			heading = { heading }
			handleSearch={ (e) => this.props.handleSearch(e) }
			navFilter={ navFilter }
			switchFilter={ (e, t) => switchFunc(e, t) }
			addBtnLink={ this.props.addBtnLink }
		/>
		var participantHeader;
		if (this.props.user.accountType == "participant") {
			participantHeader = <ParticipantHeading user={ this.props.user } 
									handleSearch={(e) => this.handleSearch(e)}
								/>
		}
		if (this.state.connections) {
			return (
				<div className='l-progress-content'>
					<Switch>
						<Route exact path='/progress/people' render={() => (
							<div>
								{participantHeader}
								<ParticipantList 
									connections={ this.state.connections }
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
						<Route exact path='/progress/goals/:id' render={() => (
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
						<Route path='/progress/people/goals/:id' render={() => (
							<div>
								{/* {this.props.currUser.accountType = "participant" ? <ParticipantList /> :
									<div> */}
										{heading('Goals', this.props.goalNavFilter, this.props.switchGoalNavFilter)}
										<Goals
											goals={ this.props.goals }
											refreshUser={() => this.props.refreshUser() }
											changeGoalFocus = { (e, goalId, goalTitle) => this.props.changeGoalFocus(e, goalId, goalTitle) }
										/> 
									{/* </div>
								} */}

							</div>
						)} />
						{/* <Route path='/Progress' render={() => (
							<div>
								{console.log(this.props.user.accountType == "participant")}
								{this.props.user.accountType == "participant" ? 
									<Redirect to='/progress/goals/people' /> :
									<Redirect to='/progress/goals' />
								}
							</div>
						)} /> */}
						<Route exact path='/progress' render={() => (
							<div>
								{console.log(this.props)}
								{this.props.user.accountType == "participant" ? 
									<Redirect to='/progress/people' /> :
									<Redirect to='/progress/goals' />
								}
							</div>
						)} />
					</Switch>
				</div>
			);
		} else {
			return <p></p>
		}
	}
}

export default withRouter(Progress);