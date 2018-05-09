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
     *      + Implement In Progress vs. Completed on search results.
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
            currentGoalNavFilter: 'inProgress',
            currentGoalCategoryId: null,
            addBtnLink: '/Progress/Goals/NewCategory',
            allGoalData: [],
            goalData: [],
            activeGoalData: [],
            completedGoalData: [],
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
        let currGoalCat = this.state.goalData
            .filter((goalCat) => goalCat.id == targetCategoryId)[0];
        let currGoalCatTasks = currGoalCat.tasks;
        currGoalCatTasks.push(newTask);
        currGoalCat.tasks = currGoalCatTasks;
        console.log(currGoalCat);

        // Push it to the server
        Axios.patch(
            'https://milestoneapi.eric-jacobson.me/goals?id=' + targetCategoryId,
            currGoalCat)
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

    addGoalComment(comment, taskId) {
        // Get a copy of the current Goal Category
        let currGoalCat = this.state.goalData
            .filter((goal) => goal.id == this.state.currentGoalCategoryId)[0];
        // Get a copy of the current Goal Category's tasks
        let currTasks = currGoalCat.tasks;
        // Get the current task and it's index to be replaced later
        let currTask;
        let currTaskIndex = -1;
        for (let i = 0; i < currTasks.length; i++) {
            if (currTasks[i].id == taskId) {
                currTask = currTasks[i];
                currTaskIndex = i;
            }
        }
        // Create the comment object
        let currDate = new Date().toISOString();
        let newCommentStruct = {
            creator: this.state.currUser.id,
            textBody: comment,
            createdAt: currDate
        }
        // Get (or initialize) the current goal's comments aray
        let commentArray = currTask.comments;
        if (!commentArray) {
            commentArray = [];
        }
        // Replace the current goal's comments; replace the Goal Category's tasks
        commentArray.push(newCommentStruct);
        currTask.comments = commentArray;
        currTasks[currTaskIndex] = currTask;
        currGoalCat.tasks = currTasks;

        console.log(currGoalCat);

        // Push it to the server
        Axios.patch(
            'https://milestoneapi.eric-jacobson.me/goals?id=' + this.state.currentGoalCategoryId,
            currGoalCat)
            .then(response => {
                return response.data;
            })
            .then(data => {
                console.log(data);
                this.getCurrentUser();
            })
            .catch(error => {
                console.log(error);
            }
        );  
    }

    changeGoalCategory(e, targetCategoryId, targetHeading) {
        // console.log('Cat changed: ' + targetCategoryId);
        // console.log(this.state.goalData);
        this.setState({
            currentGoalCategoryId: targetCategoryId,
            heading: targetHeading,
            addBtnLink: '/Progress/Goals/NewGoal/:id' + targetCategoryId
        });
    }

    editTask(taskId) {
        console.log('edit ' + taskId);
        this.props.history.push('/Progress/Goals/EditGoal/:id' + taskId);
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
                    allGoalData: data
                });

                this.sortGoals(data);
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

    markTaskComplete(taskId) {
        console.log('mark ' + taskId + ' complete');
        // Get a copy of the current Goal Category
        let currGoalCat = this.state.goalData
            .filter((goal) => goal.id == this.state.currentGoalCategoryId)[0];
        // Get a copy of the current Goal Category's tasks
        let currTasks = currGoalCat.tasks;
        // Get the current task and it's index to be replaced later
        let currTask;
        let currTaskIndex = -1;
        for (let i = 0; i < currTasks.length; i++) {
            if (currTasks[i].id == taskId) {
                currTask = currTasks[i];
                currTaskIndex = i;
            }
        }
        currTask.active = false;

        // Replace the current task; replace the Goal Category's tasks
        currTasks[currTaskIndex] = currTask;
        currGoalCat.tasks = currTasks;

        // Push it to the server
        Axios.patch(
            'https://milestoneapi.eric-jacobson.me/goals?id=' + this.state.currentGoalCategoryId,
            currGoalCat)
            .then(response => {
                return response.data;
            })
            .then(data => {
                console.log(data);
                this.getCurrentUser();
            })
            .catch(error => {
                console.log(error);
            }
        );  
    }

    sortGoals(goalData) {
        let activeGoalData = goalData.filter((goal) => goal.active == true);
        let completedGoalData = goalData.filter((goal) => goal.active == false);
        this.setState({
            activeGoalData: activeGoalData,
            completedGoalData: completedGoalData
        });
        if(this.state.currentNavFilter == "inProgress") {
            this.setState({
                goalData: activeGoalData
            });
        } else {
            this.setState({
                goalData: completedGoalData
            });
        }
    }

	switchGoalCatFilter(e, targetNavFilter) {
        let newMsLocalStore = this.updateAndGetLocalStore('prog_CurrNavFilter', targetNavFilter);
        this.setState({
            currentNavFilter: targetNavFilter,
            msLocalStore: newMsLocalStore
        });
        // this.sortGoals(this.state.allGoalData);
        if(targetNavFilter == "inProgress") {
            this.setState({
                goalData: this.state.activeGoalData
            });
        } else {
            this.setState({
                goalData: this.state.completedGoalData
            });
        }
    }

    switchGoalFilter(e, targetNavFilter) {
        this.setState({
            currentGoalNavFilter: targetNavFilter
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

    updateTask(title, date, description, targetGoalId, targetTaskId) {
        console.log('lets go');
        // Find goal and get task to update
        let currGoalCat = this.state.goalData
            .filter((goalCat) => goalCat.id == targetGoalId)[0];
        let currTasks = currGoalCat.tasks;
        // Get the current task and it's index to be replaced later
        let currTask;
        let currTaskIndex = -1;
        for (let i = 0; i < currTasks.length; i++) {
            if (currTasks[i].id == targetTaskId) {
                currTask = currTasks[i];
                currTaskIndex = i;
            }
        }
        currTask.title = title;
        currTask.description = description;
        currTask.dueDate = date;

        // Replace the current task; replace the Goal Category's tasks
        currTasks[currTaskIndex] = currTask;
        currGoalCat.tasks = currTasks;

        // Push it to the server
        Axios.patch(
            'https://milestoneapi.eric-jacobson.me/goals?id=' + this.state.currentGoalCategoryId,
            currGoalCat)
            .then(response => {
                return response.data;
            })
            .then(data => {
                console.log(data);
                this.getCurrentUser();
                this.props.history.push('/Progress/Goals/:id' + targetGoalId);
            })
            .catch(error => {
                console.log(error);
            }
        );  
    }

    render() {
        var addBtnLink = this.state.addBtnLink;
        if (this.props.location.pathname.endsWith('Progress/Goals') || 
            this.props.location.pathname.endsWith('Progress/Goals/')) {
            addBtnLink = '/Progress/Goals/NewCategory'
        }
        const currUser = this.state.currUser;
        const heading = this.state.heading;
        const targetNavFilter = this.state.currentNavFilter;
        const targetGoalNavFilter = this.state.currentGoalNavFilter;
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
                        editTask={ (taskId) => this.editTask(taskId) }
                        updateTask={ (title, date, description, targetGoalId, targetTaskId) => this.updateTask(title, date, description, targetGoalId, targetTaskId) }
                        markTaskComplete={ (taskId) => this.markTaskComplete(taskId) }
                        submitComment={ (comment, taskId) => this.addGoalComment(comment, taskId) }
                        switchGoalCatNavFilter={ (e, t) => this.switchGoalCatFilter(e, t) }
                        switchGoalNavFilter={ (e, t) => this.switchGoalFilter(e, t) }
                        // updateCurrGoalCatId={ (i) => this.updateCurrGoalCatId(i) }
                        currUser={ currUser }
                        addBtnLink={ addBtnLink }
                        goals={ goals }
                        heading={ heading }
                        navFilter={ targetNavFilter }
                        goalNavFilter={ targetGoalNavFilter }
                        searchResults={ searchResults }
                        targetGoalCategoryId = { targetGoalCategoryId }
                    />
                </div>
            )} />
        )

    }
}
export default withRouter(ProgressController);