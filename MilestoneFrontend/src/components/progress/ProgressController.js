/////////////////////////////////////////
/// Package imports

import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import moment from 'moment';
import Axios from 'axios';

/////////////////////////////////////////
/// Dev Notes

	/*
	 * 
	 */

/////////////////////////////////////////
/// Standard Components
import Progress from './Progress';

/////////////////////////////////////////
/// Images & Styles

/////////////////////////////////////////
/// Code

class ProgressController extends Component {
    constructor(props) {
        super(props);
        var msLocalStore;
        if (!localStorage.getItem('msLocalStore')) {
            msLocalStore = this.updateAndGetLocalStore('prog_CurrNavFilter', 'inProgress');
        } else {
            msLocalStore = JSON.parse(localStorage.getItem('msLocalStore'));
        }

        this.state = {
            currUser: [],
            msLocalStore: msLocalStore,
            heading: 'Goal Planning',
            currentNavFilter: msLocalStore.prog_CurrNavFilter,
            currentGoalCategoryId: null,
            addBtnLink: '/Progress/Goals/NewCategory',
            goalData: []
        };

        this.addGoal = this.addGoal.bind(this);
        this.updateAndGetLocalStore = this.updateAndGetLocalStore.bind(this);
        this.getCurrentUser = this.getCurrentUser.bind(this);
    }

    componentDidMount() {
        this.getCurrentUser();
    }

    addGoal(title, date, description, targetCategoryId) {
        let newTask = {
            GoalID: targetCategoryId,
            CreatorID: this.state.currUser.id,
            Title: title,
            Description: description
        }
        if (date) {
            newTask["dueDate"] = date
        }

        Axios.post(
            'https://milestoneapi.eric-jacobson.me/tasks',
            newTask)
            .then(response => {
                return response.data;
            })
            .then(data => {
                console.log(data);
                this.getCurrentUser();
                this.props.history.push('/Progress/Goals/:id' + targetCategoryId);
                this.props.history.replace('/Progress/Goals');
            })
            .catch(error => {
                console.log(error);
            }
        );    
    }

    addGoalCategory(goalCategory) {
        Axios.post(
            'https://milestoneapi.eric-jacobson.me/goals',
            goalCategory)
            .then(response => {
                return response.data;
            })
            .then(data => {
                console.log(data);
                this.getCurrentUser();
                this.props.history.push('/Progress/Goals');
            })
            .catch(error => {
                console.log(error);
            }
        );    
    }

    changeGoalCategory(e, targetCategoryId, targetHeading) {
        this.setState({
            currentGoalCategoryId: targetCategoryId,
            heading: targetHeading,
            addBtnLink: '/Progress/Goals/NewGoal/:id' + targetCategoryId
        });
    }

    getCurrentUser() {
        Axios.get(
            'https://milestoneapi.eric-jacobson.me/users/me', 
            {
                headers: {
                    'Authorization' : localStorage.getItem('Authorization')
                }    
            })
            .then(response => {
                return response.data;
            })
            .then(data => {
                this.setState({
                    currUser: data
                });
                
                console.log(data.id);
                this.getCurrentGoals(data.id);
            })
            .catch(error => {
                console.log(error);
            });
    }

    getCurrentGoals(id) {
        Axios.get(
            'https://milestoneapi.eric-jacobson.me/goals?id=' + id,
            { })
            .then(response => {
                return response.data;
            })
            .then(data => {
                this.setState({
                    goalData: data
                });
            });
    }

    handleSearch(e) {
        console.log("Search fired");
    }

	switchFilter(e, targetNavFilter) {
        let newMsLocalStore = this.updateAndGetLocalStore('prog_CurrNavFilter', targetNavFilter);
        this.setState({
            currentNavFilter: targetNavFilter,
            msLocalStore: newMsLocalStore
        });
    }

    updateAndGetLocalStore(key, val) {
        var newMsLocalStore = localStorage.getItem('msLocalStore');
        if (!newMsLocalStore) {
            newMsLocalStore = { };
        } else {
            newMsLocalStore = JSON.parse(newMsLocalStore);
        }
        newMsLocalStore[key] = val;
        localStorage.setItem('msLocalStore', JSON.stringify(newMsLocalStore));

        return newMsLocalStore;
    }

    render() {
        var addBtnLink = this.state.addBtnLink;
        if (this.props.location.pathname.endsWith('Progress/Goals')) {
            addBtnLink = '/Progress/Goals/NewCategory'
        }
        const currUser = this.state.currUser;
        const heading = this.state.heading;
        const targetNavFilter = this.state.currentNavFilter;
        const goals = this.state.goalData;
        const targetGoalCategoryId = this.state.currentGoalCategoryId; // Save me to localStorage!

        return (
            <Route path='/Progress' render={(props) => (
                <div>
                    <Progress
                        addGoal={ (t,dd,d,c) => this.addGoal(t,dd,d,c) }
                        addGoalCategory={ (o) => this.addGoalCategory(o) }
                        changeGoalCategory = { (e, i, t) => this.changeGoalCategory(e, i, t) }
                        refreshUser={ () => this.getCurrentUser() }
                        handleSearch={ (e) => this.handleSearch(e) }
                        switchFilter={ (e, t) => this.switchFilter(e, t) }
                        currUser={ currUser }
                        addBtnLink={ addBtnLink }
                        goals={ goals }
                        heading={ heading }
                        navFilter={ targetNavFilter }
                        targetGoalCategoryId = { targetGoalCategoryId }
                    />
                </div>
            )} />
        )

    }
}
export default withRouter(ProgressController);