/////////////////////////////////////////
/// Package imports

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Axios from 'axios';

/////////////////////////////////////////
/// Dev Notes

	/*
	 * This component is a class only to be able to access lifecycle.
     * _Please_ keep it stateless, and otherwise treat it as a 
     * functional component.
	 */

/////////////////////////////////////////
/// Standard Components
import Goal from './Goal';

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/Goals.css';

/////////////////////////////////////////
/// Code

// A component for displaying a list of a participant's goals.
class Goals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

	componentWillMount() {
        this.props.refreshUser();
        if (this.props.match.params.id) {
            var id = this.props.match.params.id.substring(3, this.props.match.params.id.length);
            this.props.getCurrentGoals(id);
        } 
    }

    // A helper function for filtering which goals are displayed if the current user is a
    // service provider. Filters out any goals which the service provider is not attached
    // to.
    filterGoals(goals) {
        if (this.props.currUser.accountType === "service provider") {
            goals = goals.filter((goal) => {
                return goal.serviceProviders.includes(this.props.currUser.id)
            })
        }
        return goals;
    }

    render() {
        let goals;
        if (this.props.allGoals) {
            let isCompletedFilter = this.props.navFilter === "completed";
            let filteredGoals = this.filterGoals(this.props.allGoals);
            filteredGoals = filteredGoals.filter((goal) => goal.completed === isCompletedFilter);
            goals = filteredGoals.map((goal) => {
                return (
                    <Goal
                        goal={ goal }
                        goalTitle={ goal.title }
                        status={ goal.active ? "Active" : "Finished" }
                        numberOfTasks={ goal.tasks.length }
                        goalId={ goal.id }
                        key={ goal.id }
                        changeGoalFocus={ (e, goalId, goalTitle) => this.props.changeGoalFocus(e, goalId, goalTitle) }
                        markGoalActive={ (goalId) => this.props.markGoalActive(goalId) }
                        markGoalComplete={ (goalId) => this.props.markGoalComplete(goalId) }
                        isServiceProvider={ this.props.isServiceProvider }
                    />
                );
            });
        }
        
        return (
            <div className="c-goals">
                { goals }
            </div>
        )
    }
}

export default withRouter(Goals);