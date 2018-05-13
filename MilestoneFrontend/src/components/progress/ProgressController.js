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
     *      + A "No Results Found" message upon an empty search. [low priority]
     *      + A "No goals yet!" message upon opening a empty goal category. [low priority]
     *      + Any necessary adjustments for desktop components.
     *      + Three-dot dropdown menu on each goal w/ 'Delete', 'Rename' & 'Mark complete' [REQUIRES ROUTE]
     *          - Finished for tasks, needs route for goals
     *          - Maybe make it so finished tasks can be 'unfinished'?
     *      + Show who resources came from.
     *      + Two way goal approval. [REQUIRES ROUTE?]
     *          - Includes 'pending' message on both goals & tasks, and maybe a pending tab.
     *          - Remove goals/tasks if either side denies?
     *      + TaskComments needs a block of code for displaying comments from users other than the current user
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
            currentTaskNavFilter: 'inProgress',
            currentGoalId: null,
            addBtnLink: '/progress/goals/newgoal',
            allGoalData: [],
            goalData: [],
            activeGoalData: [],
            completedGoalData: [],
            searchResults: []
        };

        this.addTask = this.addTask.bind(this);
        this.updateAndGetLocalStore = this.updateAndGetLocalStore.bind(this);
        this.getCurrentUser = this.getCurrentUser.bind(this);
    }

    componentDidMount() {
        this.getCurrentUser();
    }

    addTask(title, date, description, targetGoalId) {
        let newTask = {
            GoalID: targetGoalId.toString(),
            CreatorID: this.state.currUser.id.toString(),
            Title: title,
            Description: description
        }
        if (date) {
            newTask["dueDate"] = date
        }
        let currGoalCat = this.state.goalData
            .filter((goalCat) => goalCat.id == targetGoalId)[0];
        let currGoalCatTasks = currGoalCat.tasks;
        currGoalCatTasks.push(newTask);
        currGoalCat.tasks = currGoalCatTasks;
        console.log(currGoalCat);

        // Push it to the server
        Axios.patch(
            'https://milestoneapi.eric-jacobson.me/goals?id=' + targetGoalId,
            currGoalCat)
            .then(response => {
                return response.data;
            })
            .then(data => {
                console.log(data);
                this.getCurrentUser();
                this.props.history.push('/progress/goals/:id' + targetGoalId);
                this.props.history.replace('/progress/goals');
            })
            .catch(error => {
                console.error(error);
            }
        );
    }

    addGoal(goal) {
        Axios.post(
            'https://milestoneapi.eric-jacobson.me/goals',
            goal)
            .then(response => {
                return response.data;
            })
            .then(data => {
                console.log(data);
                this.getCurrentUser();
                this.props.history.push('/progress/goals');
            })
            .catch(error => {
                console.log(error);
            }
        );    
    }

    addTaskComment(comment, taskId) {
        // Get a copy of the current Goal Category
        let currGoalCat = this.state.goalData
            .filter((goal) => goal.id == this.state.currentGoalId)[0];
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
            creator: this.state.currUser.id.toString(),
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
            'https://milestoneapi.eric-jacobson.me/goals?id=' + this.state.currentGoalId,
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

    addTaskResource(resourceName, resourceUrl, taskId) {
        console.log(resourceName + ' ' + resourceUrl + ' for ' + taskId);
        // Get a copy of the current Goal
        let currGoalCat = this.state.goalData
            .filter((goal) => goal.id == this.state.currentGoalId)[0];
        // Get a copy of the current Goal's tasks
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
        let newResourceStruct = {
            title: resourceName,
            url: resourceUrl
        }
        // Get (or initialize) the current goal's resource aray
        let resourceArray = currTask.resources;
        if (!resourceArray) {
            resourceArray = [];
        }
        // Replace the current goal's comments; replace the Goal Category's tasks
        resourceArray.push(newResourceStruct);
        currTask.resources = resourceArray;
        currTasks[currTaskIndex] = currTask;
        currGoalCat.tasks = currTasks;

        console.log(currGoalCat);

        // Push it to the server
        Axios.patch(
            'https://milestoneapi.eric-jacobson.me/goals?id=' + this.state.currentGoalId,
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

    changeGoalFocus(e, targetCategoryId, targetHeading) {
        this.setState({
            currentGoalId: targetCategoryId,
            heading: targetHeading,
            addBtnLink: '/progress/goals/newtask/:id' + targetCategoryId
        });
    }

    editTask(taskId) {
        console.log('edit ' + taskId);
        this.props.history.push('/progress/goals/edittask/:id' + taskId);
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
                this.props.history.push('/progress/goals/search?q=' + search);
            });
    }

    markTaskComplete(taskId) {
        console.log('mark ' + taskId + ' complete');
        // Get a copy of the current Goal Category
        let currGoalCat = this.state.goalData
            .filter((goal) => goal.id == this.state.currentGoalId)[0];
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
            'https://milestoneapi.eric-jacobson.me/goals?id=' + this.state.currentGoalId,
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

	switchGoalNavFilter(e, targetNavFilter) {
        let newMsLocalStore = this.updateAndGetLocalStore('prog_CurrNavFilter', targetNavFilter);
        this.setState({
            currentNavFilter: targetNavFilter,
            msLocalStore: newMsLocalStore
        });
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

    switchTaskNavFilter(e, targetNavFilter) {
        this.setState({
            currentTaskNavFilter: targetNavFilter
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
            'https://milestoneapi.eric-jacobson.me/goals?id=' + this.state.currentGoalId,
            currGoalCat)
            .then(response => {
                return response.data;
            })
            .then(data => {
                console.log(data);
                this.getCurrentUser();
                this.props.history.push('/progress/goals/:id' + targetGoalId);
            })
            .catch(error => {
                console.log(error);
            }
        );  
    }

    render() {
        var addBtnLink = this.state.addBtnLink;
        if (this.props.location.pathname.endsWith('progress/goals') || 
            this.props.location.pathname.endsWith('progress/goals/')) {
            addBtnLink = '/progress/goals/newgoal'
        }
        const currUser = this.state.currUser;
        const heading = this.state.heading;
        const targetGoalNavFilter = this.state.currentNavFilter;
        const targetTaskNavFilter = this.state.currentTaskNavFilter;
        const goals = this.state.goalData;
        const searchResults = this.state.searchResults;
        const targetGoalId = this.state.currentGoalId; // Save me to localStorage!

        return (
            <Route path='/Progress' render={(props) => (
                <div>
                    <Progress
                        addTask={ (t,dd,d,c) => this.addTask(t,dd,d,c) }
                        addGoal={ (o) => this.addGoal(o) }
                        changeGoalFocus = { (e, goalId, goalTitle) => this.changeGoalFocus(e, goalId, goalTitle) }
                        refreshUser={ () => this.getCurrentUser() }
                        handleSearch={ (e) => this.handleSearch(e) }
                        editTask={ (taskId) => this.editTask(taskId) }
                        updateTask={ (title, date, description, targetGoalId, targetTaskId) => this.updateTask(title, date, description, targetGoalId, targetTaskId) }
                        markTaskComplete={ (taskId) => this.markTaskComplete(taskId) }
                        submitComment={ (comment, taskId) => this.addTaskComment(comment, taskId) }
                        submitResource={ (resourceName, resourceUrl, taskId) => this.addTaskResource(resourceName, resourceUrl, taskId) }
                        switchGoalNavFilter={ (e, t) => this.switchGoalNavFilter(e, t) }
                        switchTaskNavFilter={ (e, t) => this.switchTaskNavFilter(e, t) }
                        currUser={ currUser }
                        addBtnLink={ addBtnLink }
                        goals={ goals }
                        heading={ heading }
                        goalNavFilter={ targetGoalNavFilter }
                        taskNavFilter={ targetTaskNavFilter }
                        searchResults={ searchResults }
                        targetGoalId = { targetGoalId }
                    />
                </div>
            )} />
        )

    }
}
export default withRouter(ProgressController);