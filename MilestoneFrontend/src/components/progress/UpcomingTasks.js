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

class UpcomingTasks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
	}

	componentDidMount() {
		this.props.refreshUser();
		console.log(this.props);
		var id = this.props.location.pathname.split(':id')[1];
		if (this.props.location.pathname.includes('provider')) {
			id = this.props.location.pathname.split(':goalid')[1];
		}
		if (id) {
			this.props.goalController.getSpecificGoal(id)
			.then((data) => {
				this.setState({
					currGoal: data
				})
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
		console.log(this.props.goals)
		let sortGoalTasks = this.props.goals.map((goal) => {
			return goal.tasks.sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate))
	   });
	   let targetGoalId = this.props.location.pathname.split(':id')[1];
	   if (this.props.location.pathname.includes('provider')) {
		   targetGoalId = this.props.location.pathname.split(':goalid')[1];
	   }
	   // let tasks = <Redirect to='/progress/goals/'></Redirect>; 
	   let tasks;
	   let isActive = this.props.navFilter == "inProgress" ? true : false;
	   if (this.state.currGoal && targetGoalId) { // add else to get id from path
			console.log(this.state.currGoal);
		   const targetGoal = this.props.goals.filter(goal => goal.id == targetGoalId);
		//    if (targetGoal && targetGoal[0]) {
		// 	   const filteredGoals = targetGoal[0].tasks.filter((task) => task.active == isActive)
			const filteredGoals = this.state.currGoal.tasks.filter((task) => task.active == isActive)
			   tasks = filteredGoals.map((task) => {
				   return (
					   <Task
						   goal={ this.state.currGoal }
						   task={ task } 
						   taskId={ task.id }
						   key={ task.id }
						   editTask={ (taskId) => this.props.editTask(taskId) }
						   markTaskComplete={ (taskId) => this.props.markTaskComplete(taskId) }
					   />
				   );
			   });
		//    }
	   }
		return (
			<div className='[ container ] l-upcoming-goals'>
				{ tasks }
			</div>
		);
	}


}

export default withRouter(UpcomingTasks);