/////////////////////////////////////////
/// Package imports

import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import moment from 'moment';
import Axios from 'axios';

/////////////////////////////////////////
/// Dev Notes

	/*
	 * //TODO: 
     *      + A "No Results Found" message upon an empty search.
     *      + A "No goals yet!" message upon opening a empty goal category.
     *      + Any necessary adjustments for desktop components.
     *      + Reformat UpcomingGoals.js to remove date on dateless goals and to match designs more closely.
     *      + Implement In Progress vs. Completed.
     *      + Three-dot dropdown menu on each goal w/ 'Delete', 'Rename' & 'Mark complete' [REQUIRES ROUTE]
     *      + Comments. [REQUIRES ROUTE]
     *      + Resources. [REQUIRES ROUTE]
     *      + Implement attaching Service Providers to goals upon creation. [REQUIRES ROUTE]
     *      + Two way goal approval. [REQUIRES ROUTE]
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
            goalData: [],
            searchResults: []
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
        e.preventDefault();
        let input = document.getElementById('progressSearch');
		let search = input.value;
		input.value = '';

        Axios.get(
            'https://milestoneapi.eric-jacobson.me/goals?id=' + this.state.currUser.id + '&q=' + search,
            { })
            .then(response => {
                return response.data;
            })
            .then(data => {
                this.setState({
                    searchResults: data
                });
                console.log(data);
                this.props.history.push('/Progress/Goals/Search?q=' + search);
            });
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
        const searchResults = this.state.searchResults;
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
                        searchResults={ searchResults }
                        targetGoalCategoryId = { targetGoalCategoryId }
                    />
                </div>
            )} />
        )

    }
}
export default withRouter(ProgressController);