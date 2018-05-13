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

class Goals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

	componentWillMount() {
        this.props.refreshUser();
        var id = this.props.match.params.id.substring(3, this.props.match.params.id.length)
        Axios.get(
            'https://milestoneapi.eric-jacobson.me/goals?id=' + id)
            .then(response => {
                return response.data;
            })
            .then(data => {
                this.setState({
                    goals: data
                })
            })
            .catch(error => {
                console.log(error);
            }
        );  
    }
    
    componentWillReceiveProps(nextProps) {
        var currID = this.props.match.params.id.substring(3, this.props.match.params.id.length)
        var nextID = nextProps.match.params.id.substring(3, nextProps.match.params.id.length)
        if (currID !== nextID && nextID) {
            Axios.get(
                'https://milestoneapi.eric-jacobson.me/goals?id=' + nextID)
                .then(response => {
                    return response.data;
                })
                .then(data => {
                    this.setState({
                        goals: data
                    })
                })
                .catch(error => {
                    console.log(error);
                }
            );  
        }
    }

    render() {
        var goals;
        if (this.state.goals) {
            goals = this.state.goals.map((goal) => {
                return (
                    <Goal
                        goal={ goal }
                        goalTitle={ goal.title }
                        status={ goal.active ? "Active" : "Finished" }
                        numberOfTasks={ goal.tasks.length }
                        goalId={ goal.id }
                        key={ goal.id }
                        changeGoalFocus={ (e, goalId, goalTitle) => this.props.changeGoalFocus(e, goalId, goalTitle) }
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