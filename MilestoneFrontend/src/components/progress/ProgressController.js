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
     *      + Any necessary adjustments for desktop components. [IN PROGRESS]
     *      + Three-dot dropdown menu on each goal w/ 'Delete', 'Rename' & 'Mark complete' [REQUIRES ROUTE]
     *          - Finished for tasks, needs route for goals
     *          - Maybe make it so finished tasks can be 'unfinished'?
     *      + Show who resources came from.
     *      + Show who comments came from.
     *      + Two way goal approval. [REQUIRES ROUTE?]
     *          - Includes 'pending' message on both goals & tasks, and maybe a pending tab.
     *          - Remove goals/tasks if either side denies?
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
            isParticipant: null,
            isServiceProvider: null,
            participantUserId: null,
            connections: [],
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

    addGoal(goal) {
        console.log(goal);
        if (this.state.isServiceProvider) {
            goal.UserID = this.state.participantUserId;
            this.props.userController.getContact(goal.UserID)
            .then((data) => {
                var notifications = data.notifications;
                var newNotification = {
                    Sender: "" + this.state.currUser.id,
                    TimeSent: new Date(),
                    Read: false,
                    Body: this.state.currUser.fullName +  " has created a new goal.",
                    ContentType: "goal",
                    ContentRoute: "/progress/goals",
                }
                notifications.push(newNotification);
                this.props.userController.postNotification(notifications, data.id)
                .then(data => {
                    console.log(data);
                })
            });
        } else {
            let connections = this.state.currUser.connections;
            for (let i = 0; i < connections.length; i++) {
                this.props.userController.getContact(connections[i].id)
                .then((data) => {
                    var notifications = data.notifications;
                    var newNotification = {
                        Sender: "" + this.state.currUser.id,
                        TimeSent: new Date(),
                        Read: false,
                        Body: this.state.currUser.fullName +  " has created a new goal.",
                        ContentType: "goal",
                        ContentRoute: "/progress/provider/participants/goals/:id" + this.state.currUser.id,
                    }
                    notifications.push(newNotification);
                    this.props.userController.postNotification(notifications, data.id)
                    .then(data => {
                        console.log(data);
                    })
                });
            }
        }
        this.props.goalController.addGoal(goal)
        .then((data) => {
            this.getCurrentUser();
            this.props.history.push('/progress/goals');
        });
    }

    addTask(title, date, description, targetGoalId) {
        let isActive = this.state.isServiceProvider ? true : false;
        let newTask = {
            GoalID: targetGoalId.toString(),
            CreatorID: this.state.currUser.id.toString(),
            Title: title,
            Description: description,
            id: this.generateUUID(),
            completed: false,
            active: isActive
        }
        if (date) {
            newTask["dueDate"] = date
        }
        let currGoalCat = this.state.goalData
            .filter((goalCat) => goalCat.id == targetGoalId)[0];
        let currGoalCatTasks = currGoalCat.tasks;
        currGoalCatTasks.push(newTask);
        currGoalCat.tasks = currGoalCatTasks;
        if (this.state.isParticipant) {
            let connections = this.state.currUser.connections;
            for (let i = 0; i < connections.length; i++) {
                this.props.userController.getContact(connections[i].id)
                .then((data) => {
                    var notifications = data.notifications;
                    var newNotification = {
                        Sender: "" + this.state.currUser.id,
                        TimeSent: new Date(),
                        Read: false,
                        Body: this.state.currUser.fullName +  " has created a new task.",
                        ContentType: "goal",
                        ContentRoute: "/progress/provider/participants/goals/tasks/:id" + targetGoalId.toString(),
                    }
                    notifications.push(newNotification);
                    this.props.userController.postNotification(notifications, data.id)
                    .then(data => {
                        console.log(data);
                    })
                });
            }
        } else if (this.state.isServiceProvider) {
            this.props.userController.getContact(currGoalCat.userID)
            .then((data) => {
                var notifications = data.notifications;
                var newNotification = {
                    Sender: "" + this.state.currUser.id,
                    TimeSent: new Date(),
                    Read: false,
                    Body: this.state.currUser.fullName +  " has created a new task.",
                    ContentType: "goal",
                    ContentRoute: "/progress/goals/:id" + targetGoalId.toString(),
                }
                notifications.push(newNotification);
                this.props.userController.postNotification(notifications, data.id)
                // .then(data => {
                //     console.log(data);
                // })
            });
        }
        // Push it to the server
        this.props.goalController.updateGoal(targetGoalId, currGoalCat)
        .then((data) => {
            this.getCurrentUser();
            this.props.history.replace('/progress/goals');
            
            if (this.state.isServiceProvider) {
                this.props.history.push('/progress/provider/participants/goals/tasks/:id' + targetGoalId);
            } else {
                this.props.history.push('/progress/goals/:id' + targetGoalId);
            }
        });
    }

    addTaskComment(comment, taskId) {
        // Get a copy of the current Goal Category
        console.log(this.state.currentGoalId);
        let currGoal = this.state.goalData
            .filter((goal) => goal.id === this.state.currentGoalId)[0];
        // Get a copy of the current Goal Category's tasks
        let currTasks = currGoal.tasks;
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
        currGoal.tasks = currTasks;

        console.log(currGoal);

        // Push it to the server
        this.props.goalController.updateGoal(this.state.currentGoalId, currGoal)
        .then((data) => {
            this.getCurrentUser();
        });
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
        this.props.goalController.updateGoal(this.state.currentGoalId, currGoalCat)
        .then((data) => {
            this.getCurrentUser();
        });
    }

    changeGoalFocus(e, targetCategoryId, targetHeading) {
        this.setState({
            currentGoalId: targetCategoryId,
            heading: targetHeading,
            addBtnLink: '/progress/goals/newtask/:id' + targetCategoryId
        });
    }

    generateUUID() { // Public Domain/MIT
        var d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
	
	getConnections(search) {
        this.props.userController.getUserConnections(search, this.state.currUser.id)
        .then((data) => {
            this.setState({
                connections: data
            });
        });
	}

    getCurrentUser() {
        this.props.userController.getUser()
        .then((data) => {
            this.setState({
                currUser: data,
                user: data,
                isParticipant: data.accountType === "participant",
                isServiceProvider: data.accountType === "service provider"
            }, () => {
                if (data.accountType === "participant") {
                    this.getCurrentGoals(data.id);
                } else {
                    this.getConnections('');
                }
            });
        });
    }

    getCurrentGoals(id) {
        this.props.goalController.getGoals(id, "")
        .then((data) => {
            this.setState({
                allGoalData: data,
                participantUserId: id
            });
            this.sortGoals(data);
        });
    }

    editTask(taskId) {
        // console.log('edit ' + taskId);
        this.props.history.push('/progress/goals/edittask/:id' + taskId);
    }

    handleSearch(e) {
        e.preventDefault();
        let input = document.getElementById('progressSearch');
		let search = input.value;
        input.value = '';
        let id = this.state.currUser.id
        if (this.props.location.pathname.includes('provider')) {
            id = this.state.participantUserId
        }
        this.props.goalController.getGoals(id, search)
        .then((data) => {
            this.setState({
                searchResults: data
            });
            this.props.history.push('/progress/goals/search?q=' + search);
        });

    }

    markGoalActive(goalId) { 
        console.log('Mark ' + goalId + ' active');
        // Get a copy of the current Goal
        let currGoal = this.state.allGoalData
            .filter((goal) => goal.id === goalId)[0];

        // Swap the goal's completed status
        currGoal.active = !currGoal.active;

        // // Push it to the server
        this.props.goalController.updateGoal(goalId, currGoal)
        .then((data) => {
            this.getCurrentUser();
        });
    }

    markGoalComplete(goalId) {
        console.log('Mark ' + goalId + ' complete');
        // Get a copy of the current Goal
        let currGoal = this.state.allGoalData
            .filter((goal) => goal.id === goalId)[0];

        // Swap the goal's completed status
        currGoal.completed = !currGoal.completed;

        // // Push it to the server
        this.props.goalController.updateGoal(goalId, currGoal)
        .then((data) => {
            this.getCurrentUser();
        });
    }

    markTaskActive(taskId) {
        console.log('mark ' + taskId + ' active');
        // Get a copy of the current Goal Category
        let currGoal = this.state.goalData
            .filter((goal) => goal.id == this.state.currentGoalId)[0];
        // Get a copy of the current Goal Category's tasks
        let currTasks = currGoal.tasks;
        // Get the current task and it's index to be replaced later
        let currTask;
        let currTaskIndex = -1;
        for (let i = 0; i < currTasks.length; i++) {
            if (currTasks[i].id == taskId) {
                currTask = currTasks[i];
                currTaskIndex = i;
            }
        }
        currTask.active = true;

        // Replace the current task; replace the Goal Category's tasks
        currTasks[currTaskIndex] = currTask;
        currGoal.tasks = currTasks;

        // Push it to the server
        this.props.goalController.updateGoal(this.state.currentGoalId, currGoal)
        .then((data) => {
            this.getCurrentUser();
        });
    }

    markTaskComplete(taskId) {
        console.log('mark ' + taskId + ' complete');
        // Get a copy of the current Goal Category
        let currGoal = this.state.goalData
            .filter((goal) => goal.id == this.state.currentGoalId)[0];
        // Get a copy of the current Goal Category's tasks
        let currTasks = currGoal.tasks;
        // Get the current task and it's index to be replaced later
        let currTask;
        let currTaskIndex = -1;
        for (let i = 0; i < currTasks.length; i++) {
            if (currTasks[i].id == taskId) {
                currTask = currTasks[i];
                currTaskIndex = i;
            }
        }
        currTask.completed = !currTask.completed;

        // Replace the current task; replace the Goal Category's tasks
        currTasks[currTaskIndex] = currTask;
        currGoal.tasks = currTasks;

        // Push it to the server
        this.props.goalController.updateGoal(this.state.currentGoalId, currGoal)
        .then((data) => {
            this.getCurrentUser();
        });
    }

    sortGoals(goalData) {
        let activeGoalData = goalData.filter((goal) => goal.completed === false);
        let completedGoalData = goalData.filter((goal) => goal.completed === true);
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

    updateGoal(goal) {
        this.props.goalController.updateGoal(goal.id, goal)
        .then((data) => {
            this.getCurrentUser();
            this.props.history.replace('/progress/goals');
        });
    }

    updateTask(title, date, description, targetGoalId, targetTaskId) {
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
        this.props.goalController.updateGoal(this.state.currentGoalId, currGoalCat)
        .then((data) => {
            this.getCurrentUser();
            this.props.history.push('/progress/goals/:id' + targetGoalId);
        });
    }

    render() {
        var addBtnLink = this.state.addBtnLink;
        if (this.props.location.pathname.endsWith('progress/goals') || 
            this.props.location.pathname.endsWith('progress/goals/') ||
            this.props.location.pathname.includes('/progress/provider/participants/goals/:id')) {
            addBtnLink = '/progress/goals/newgoal'
        }
        const currUser = this.state.currUser;
        const connections = this.state.connections;
        const heading = this.state.heading;
        const targetGoalNavFilter = this.state.currentNavFilter;
        const targetTaskNavFilter = this.state.currentTaskNavFilter;
        const goals = this.state.goalData;
        const allGoals = this.state.allGoalData;
        const searchResults = this.state.searchResults;
        const targetGoalId = this.state.currentGoalId; // Save me to localStorage!
        const isParticipant = this.state.isParticipant;
        const isServiceProvider = this.state.isServiceProvider;
        const participantUserId = this.state.participantUserId;
        if (this.state && this.state.user) {
            return (
                <Route path='/progress' render={(props) => (
                    <div>
                        <Progress
                            addTask={ (t,dd,d,c) => this.addTask(t,dd,d,c) }
                            addGoal={ (o) => this.addGoal(o) }
                            changeGoalFocus = { (e, goalId, goalTitle) => this.changeGoalFocus(e, goalId, goalTitle) }
                            getCurrentGoals={ (id) => this.getCurrentGoals(id) }
                            getConnections={ (search) => this.getConnections(search) }
                            handleSearch={ (e) => this.handleSearch(e) }
                            editTask={ (taskId) => this.editTask(taskId) }
                            markGoalActive={ (goalId) => this.markGoalActive(goalId) }
                            markGoalComplete={ (goalId) => this.markGoalComplete(goalId) }
                            markTaskActive={ (taskId) => this.markTaskActive(taskId)    }
                            markTaskComplete={ (taskId) => this.markTaskComplete(taskId) }
                            refreshUser={ () => this.getCurrentUser() }
                            submitComment={ (comment, taskId) => this.addTaskComment(comment, taskId) }
                            submitResource={ (resourceName, resourceUrl, taskId) => this.addTaskResource(resourceName, resourceUrl, taskId) }
                            switchGoalNavFilter={ (e, t) => this.switchGoalNavFilter(e, t) }
                            switchTaskNavFilter={ (e, t) => this.switchTaskNavFilter(e, t) }
                            updateTask={ (title, date, description, targetGoalId, targetTaskId) => this.updateTask(title, date, description, targetGoalId, targetTaskId) }
                            updateGoal={ (goal) => this.updateGoal(goal) }
                            addBtnLink={ addBtnLink }
                            allGoals={ allGoals }
                            currUser={ currUser }
                            connections={ connections }
                            goals={ this.state.goalData }
                            goalController={ this.props.goalController }
                            goalNavFilter={ targetGoalNavFilter }
                            heading={ heading }
                            isParticipant={ isParticipant }
                            isServiceProvider={ isServiceProvider }
                            participantUserId={ participantUserId }
                            searchResults={ searchResults }
                            taskNavFilter={ targetTaskNavFilter }
                            targetGoalId = { targetGoalId }
                            user={ this.state.user }
                        />
                    </div>
                )} />
            )
        } else {
            return <p></p>
        }
    }
}

export default withRouter(ProgressController);