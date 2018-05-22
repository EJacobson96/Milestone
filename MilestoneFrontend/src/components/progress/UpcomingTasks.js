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
// /// Code

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
				}
			});
		}
	}

	componentWillReceiveProps() {
		// if (this.props.match.params.id) {
		// 	var id = this.props.match.params.id.substring(3, this.props.match.params.id.length);
		// 	this.props.goalController.getSpecificGoal(id)
		// 	.then((data) => {
		// 		currGoal: data
		// 	});
        // }
	}

	render() {
		let sortGoalTasks = this.props.goals.map((goal) => {
			return goal.tasks.sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate))
		});
		let targetGoalId = this.props.location.pathname.split(':id')[1];
		if (this.props.location.pathname.includes('provider')) {
			targetGoalId = this.props.location.pathname.split(':id')[1];
		}
		// let tasks = <Redirect to='/progress/goals/'></Redirect>; 
		const targetGoal = this.props.goals.filter(goal => goal.id == targetGoalId);
		let tasks;
		let isComplete = this.props.navFilter === "completed" ? true : false;
		if (this.state.currGoal && targetGoalId) { // add else to get id from path
			let targetGoal;
			if (this.props.goals.length > 0) {
				targetGoal = this.props.goals.filter(goal => goal.id === targetGoalId)[0];
			} else {
				targetGoal = this.state.currGoal;
			}
			const filteredTasks = targetGoal.tasks.filter((task) => task.completed === isComplete);
			tasks = filteredTasks.map((task) => {
				return (
					<Task
						goal={ targetGoal }
						task={ task } 
						taskId={ task.id }
						key={ task.id }
						editTask={ (taskId) => this.props.editTask(taskId) }
						markTaskComplete={ (taskId) => this.props.markTaskComplete(taskId) }
					/>
				);
			});
	   	}
		return (
			<div className='[ container ] l-upcoming-goals'>
				{ tasks }
			</div>
		);
	}
}

export default withRouter(UpcomingTasks);

// const UpcomingTasks = (props) => {
// 	console.log(props);
// 	let sortGoalTasks = props.goals.map((goal) => {
// 		 return goal.tasks.sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate))
// 	});
// 	let targetGoalId = props.location.pathname.split(':id')[1];
// 	if (props.location.pathname.includes('provider')) {
// 		targetGoalId = props.location.pathname.split(':id')[1];
// 	}
// 	let tasks = <Redirect to='/progress/goals/'></Redirect>; // <div></div>;
// 	let isComplete = props.navFilter === "completed" ? true : false;
// 	if (props.goals && targetGoalId) { // add else to get id from path
// 		const targetGoal = props.goals.filter(goal => goal.id == targetGoalId);
// 		if (targetGoal) {
// 			console.log(targetGoal[0]);
// 			const filteredGoals = targetGoal[0].tasks.filter((task) => task.completed === isComplete);
// 			tasks = filteredGoals.map((task) => {
// 				return (
// 					<Task
// 						goal={ targetGoal[0] }
// 						task={ task } 
// 						taskId={ task.id }
// 						key={ task.id }
// 						editTask={ (taskId) => props.editTask(taskId) }
// 						markTaskComplete={ (taskId) => props.markTaskComplete(taskId) }
// 					/>
// 				);
// 			});
// 		}
// 	}

// 	return (
// 		<div className='[ container ] l-upcoming-goals'>
// 			{ tasks }
// 		</div>
// 	);
// }

// export default withRouter(UpcomingTasks);