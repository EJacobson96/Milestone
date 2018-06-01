/////////////////////////////////////////
/// Package imports

import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Dev Notes

	/*
	 *
	 */

/////////////////////////////////////////
/// Standard Components
import Task from './Task';

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/UpcomingTasks.css';

/////////////////////////////////////////
/// Code

// A component for displaying all tasks attached to current goal. To ensure that
// all information regarding the goal is as up to date as possible, this component
// retrieves live data at the moment of creation based on the goal's id retrieved
// from the current URL.
class UpcomingTasks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
	}

	componentDidMount() {
		this.props.refreshUser();
		var id = this.props.location.pathname.split(':id')[1];
		if (this.props.location.pathname.includes('provider')) {
			id = this.props.location.pathname.split(':id')[1];
		}
		if (id) {
			this.props.goalController.getSpecificGoal(id)
			.then((data) => {
				this.setState({
					currGoal: data
				});
				if (!this.props.targetGoalId) {
					this.props.changeGoalFocus(null, id, data.title);
				}
				if (this.props.isServiceProvider) {
					this.props.getConnections();
					this.props.getSpecificGoal(id);
				}
			});
		}
	}

	// componentWillReceiveProps(nextProps) {
	// 	if (this.props !== nextProps) {
	// 		let targetGoalId = nextProps.location.pathname.split(':id')[1];
	// 		let targetGoalTitle = nextProps.goals.filter(goal => goal.id === targetGoalId)[0];
	// 		this.props.changeGoalFocus(null, targetGoalId, targetGoalTitle);
	// 	}
	// }

	render() {
		let sortGoalTasks = this.props.goals.map((goal) => {
			return goal.tasks.sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate))
		});
		let targetGoalId = this.props.location.pathname.split(':id')[1];
		if (this.props.location.pathname.includes('provider')) {
			targetGoalId = this.props.location.pathname.split(':id')[1];
		}
		// let tasks = <Redirect to='/progress/goals/'></Redirect>; 
		// const targetGoal = this.props.goals.filter(goal => goal.id == targetGoalId);
		let tasks;
		let isComplete = this.props.navFilter === "completed" ? true : false;
		let targetGoal = {title:''};
		// Ensures that all necessary data is available
		if (this.state.currGoal && targetGoalId) { // add else to get id from path
			if (this.props.goals.length > 0) {
				targetGoal = this.props.goals.filter(goal => goal.id === targetGoalId)[0];
			} else {
				targetGoal = this.state.currGoal;
			}
			// Filters task based on the current nav filter ('inProgress' vs 'complete')
			const filteredTasks = targetGoal.tasks.filter((task) => task.completed === isComplete);
			tasks = filteredTasks.map((task) => {
				return (
					<Task
						goal={ targetGoal }
						task={ task } 
						taskId={ task.id }
						key={ task.id }
						editTask={ (taskId) => this.props.editTask(taskId) }
						markTaskActive={ (taskId, goal) => this.props.markTaskActive(taskId, goal) }
						markTaskComplete={ (taskId, goal) => this.props.markTaskComplete(taskId, goal) }
						isParticipant={ this.props.isParticipant }
						isServiceProvider={ this.props.isServiceProvider }
					/>
				);
			});
	   	}
		return (
			<div>
				{ this.props.heading(targetGoal.title) }
				<div className='[ container ] l-upcoming-goals'>
					{ tasks }
				</div>
			</div>
		);
	}
}

export default withRouter(UpcomingTasks);