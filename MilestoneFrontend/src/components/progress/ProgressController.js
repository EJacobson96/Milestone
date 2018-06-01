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
	 */

/////////////////////////////////////////
/// Standard Components
import Progress from './Progress';

/////////////////////////////////////////
/// Images & Styles

/////////////////////////////////////////
/// Code

// This very large container component is intended to act as the primary controller for
// as much of the functionality present in Milestone's 'Progress' feature as possible.
// Any component within 'Progress' passes data and functionality upwards to ProgressController
// for manipulation and storage to the extent that it's possible to do so. This includes
// UI manipulation and most HTTP calls to Milestone's backend. Most necessary state is also
// stored in this controller in order to keep all sub-components as lean as possible. Please
// see the comments on each method for additional information. ProgressController works in conjunction
// with the goalController object (see /src/controller/GoalController.js) in order to send api calls
// to Milestone's back end services. the GoalController is passed as a prop to ProgressController from
// main.js.
class ProgressController extends Component {
    constructor(props) {
        super(props);
        var msLocalStore;
        if (!localStorage.getItem('msLocalStore')) {
            msLocalStore = this.updateAndGetLocalStore('prog_CurrNavFilter', 'inProgress');
        } else {
            msLocalStore = JSON.parse(localStorage.getItem('msLocalStore'));
        }

        // ProgressController stores a lot of state. The summary is as follows:
        // currUser: the current user's user data.
        // isParticipant: a boolean to store whether the current user is a participant.
        // isServiceProvider: a boolean to store whether the current user is a service provider.
        // participantUserId: a string for storing the currently viewed participant's userId when
        // working as a service provider.
        // connections: an array of the current user's connections.
        // msLocalStore: an object of information to be kept in sync with and stored in
        // a matching string stored in localStorage.
        // heading: a string for storing the currently displayed component's heading, to be 
        // utilized by ProgressHeading.
        // currentNavFilter: the current filter for any displayed goals ('inProgress' or 'completed').
        // currentTaskNavFilter: the current filter for any displays tasks ('inProgress' or
        // 'completed').
        // currentGoalId: the id of the goal currently being manipulaed.
        // addBtnLink: the link to be attached to the '+' button being utilized in the
        // the currently displayed component.
        // allGoalData: all goal data for the participant currently being viewed.
        // goalData: the set of goals filtered by the current nav filter. Mostly deprecated.
        // activeGoalData: the goals marked as 'active' for the participant currently being viewed. Mostly deprecated.
        // completedGoalData: the goals marked as 'completed' for the participant currently being view.
        // Mostly deprecated.
        // searchResults: an array storing the search results of whichever search function was last utilized.
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
        console.log(this.props);
        this.getCurrentUser();
    }

    // A function which accepts a goal object passed from a sub-component of ProgressController
    // that utilizes the goalController object to pass the new new goal to the server and the
    // userController object to post a new notification to the appropriate user. Acts differently
    // based on whether the current user is a service provider or participant.
    addGoal(goal) {
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

    // A function which accepts the necessary string to create a new task object passed from a 
    // sub-component of ProgressController, that utilizes the goalController object to pass the 
    // new new task to the server and the userController object to post a new notification to the 
    // appropriate user. Acts differently based on whether the current user is a service provider 
    // or participant.
    addTask(title, date, description, targetGoalId) {
        let isActive = this.state.isServiceProvider ? true : false;
        // Create the new task from parameters.
        let newTask = {
            GoalID: targetGoalId.toString(),
            CreatorID: this.state.currUser.id.toString(),
            Title: title,
            Description: description,
            id: this.generateUUID(),
            completed: false,
            active: isActive
        }
        // Adds the due date to the task, if applicable.
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

    // A function which accepts a comment string, taskId string and goal object passed from
    // a sub-component of ProgressController in order to update a given task with the new comment,
    // update the necessary goal and pass the data as a patch request to the server through
    // the goalController object.
    addTaskComment(comment, taskId, goal) {
        // Get a copy of the current Goal Category
        let currGoal = goal;
        // this.state.goalData
        //     .filter((goal) => goal.id === this.state.currentGoalId)[0];
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

        // Push it to the server
        this.props.goalController.updateGoal(this.state.currentGoalId, currGoal)
        .then((data) => {
            this.getCurrentUser();
        });
    }

    // A function which accepts a resource name string, resource URL string, taskId string 
    // and goal object passed from a sub-component of ProgressController in order to update 
    // a given task with the new resource, update the necessary goal and pass the data as a 
    // patch request to the server through the goalController object.
    addTaskResource(resourceName, resourceUrl, taskId, goal) {
        console.log(resourceName + ' ' + resourceUrl + ' for ' + taskId);
        // Get a copy of the current Goal
        let currGoal = this.state.goalData
            .filter((goal) => goal.id == this.state.currentGoalId)[0];
        // Get a copy of the current Goal's tasks
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
        currGoal.tasks = currTasks;

        // Push it to the server
        this.props.goalController.updateGoal(this.state.currentGoalId, currGoal)
        .then((data) => {
            this.getCurrentUser();
        });
    }

    // A function which accepts a goalId and targetHeading string in order to update the
    // ProgressController's state as to which goal is currently being manipulated.
    changeGoalFocus(e, targetCategoryId, targetHeading) {
        this.setState({
            currentGoalId: targetCategoryId,
            heading: targetHeading,
            addBtnLink: '/progress/goals/newtask/:id' + targetCategoryId
        });
    }

    // A helper function from the public domain courtesy of MIT for generating UUID's via
    // JavaScript on the client side. Used when creating a new task to ensure a unique taskId.
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
    
    // A function to retrieve all connections attached to current user. Accepts a
    // a search parameter of type string to filter connections based on a search
    // query.
	getConnections(search) {
        this.props.userController.getUserConnections(search, this.state.currUser.id)
        .then((data) => {
            this.setState({
                connections: data
            });
        });
    }
    
    // A function to retrieve all resources attached to the current user of type
    // service provider in order to be manipulated via the resources function for
    // service providers. Accepts a search parameter of type string to filter 
    // resouces based on a search query.
    getResources(search) {
        console.log(this.state)
        this.props.goalController.getResources(this.state.currUser.id)
        .then((data) => {
            console.log(data);
            let filteredResources;
            if (search) {
                filteredResources = data.filter((category) => {
                    return category.title.toLowerCase().includes(search.trim().toLowerCase());
                })
                this.setState({
                    resourceCategories: filteredResources,
                })
            } else {
                this.setState({
                    resourceCategories: data,
                })
            }
        })
    }

    // A function which accepts a resource id to be passed to the goalController object
    // in order to delete a specific resourceCategory from the server.
    deleteResourceCategory(id) {
        return this.props.goalController.deleteResourceCategory(id)
    }

    // A function to get or refresh all data about the current user and update
    // ProgressController and all of its sub-component's state. If the current user
    // is a participant, this function will then call getCurrentGoals in order to refresh
    // all of the user's current goals; if current user is a service provider, then
    // the function will make calls to getConnections and getResources in order to refresh
    // the current user's list of connections and current resources.
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
                    this.getResources('');
                }
            });
        });
    }

    // A function which accepts a user id to pass to the goalController object
    // in order to update ProgressController and all children's state with that
    // user's most recent goals, as well as update the current participantId if
    // the current user is a service provider.
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

    // A function which accepts a specific goalId to pass to the goalController
    // object in order to update ProgressController and all children's state with
    // a refresh of the given goal's owner's goals.
    getSpecificGoal(goalId) {
        this.props.goalController.getSpecificGoal(goalId)
        .then((data) => {
            this.setState({
                heading: data.title
            });
            this.getCurrentGoals(data.userID);
        });
    }

    // A function to navigate to the EditTask component with a given parameter
    // taskId of type string.
    editTask(taskId) {
        // console.log('edit ' + taskId);
        this.props.history.push('/progress/goals/edittask/:id' + taskId);
    }

    // Handles the search of a specific participant's goals by acquiring the search
    // query from the current element with id 'progressSearch' and passing that query
    // along with the current participantUserId from state to the goalController object.
    // Also clears the search input and navigates the user to the search results.
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

    // Accepts a parameter goalId of type string, then searches the current
    // state's allGoalData object for the specific goal to mark active and passes
    // the updated goal to the goalController object. Afterwards, this function makes
    // a call to getCurrentUser in order to refresh the displayed goals.
    markGoalActive(goalId) { 
        // console.log('Mark ' + goalId + ' active');
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

    // Accepts a parameter goalId of type string, then searches the current
    // state's allGoalData object for the specific goal to mark complete or incomplete and passes
    // the updated goal to the goalController object. Afterwards, this function makes
    // a call to getCurrentUser in order to refresh the displayed goals.
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

    // Accepts a parameter taskId of type string and a goal object, then finds the
    // specific task within the goal, updates the task's active status and passes
    // the updated goal to the goalController object. Afterwards, this function makes
    // a call to getCurrentUser in order to refresh the displayed tasks.
    markTaskActive(taskId, goal) {
        console.log('mark ' + taskId + ' active');
        // Get a copy of the current Goal Category
        let currGoal = goal;
        if (!goal) {
            currGoal = this.state.goalData
                .filter((goal) => goal.id == this.state.currentGoalId)[0];
        }
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

    // Accepts a parameter taskId of type string and a goal object, then finds the
    // specific task within the goal, updates the task's complete status and passes
    // the updated goal to the goalController object. Afterwards, this function makes
    // a call to getCurrentUser in order to refresh the displayed tasks.
    markTaskComplete(taskId, goal) {
        console.log('mark ' + taskId + ' complete');
        // Get a copy of the current Goal Category
        let currGoal = goal;
        if (!goal) {
            currGoal = this.state.goalData
                .filter((goal) => goal.id == this.state.currentGoalId)[0];
        }
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

    // Accepts an object containing a user's goal data, then sorts the current goals by completed status
    // and saves the sorted goals in state.
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

    // Updates the current navigation filter for currently displays goals and saves the new filter
    // to state and localStorage. Accepts a targetNavFilter parameter of type string.
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

    // Updates the current task navigation filter based on a targetNavFilter of type string
    // by saving the given filter to state.
    switchTaskNavFilter(e, targetNavFilter) {
        this.setState({
            currentTaskNavFilter: targetNavFilter
        });
    }

    // A helper function for updating local storage with a given key and val parameter.
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

    // Accepts a goal object the passes that goal object with its own id to the
    // goalController object in order to update the given goal with any new data
    // that may be contained within. Afterwards, a call to getCurrentUser is made
    // to refresh any goals, and the user is navigated back to a list of the current
    // participant's goals.
    updateGoal(goal) {
        this.props.goalController.updateGoal(goal.id, goal)
        .then((data) => {
            this.getCurrentUser();
            this.props.history.replace('/progress/goals');
        });
    }

    // Accepts a series of strings necessary to construct a task object and a goal object,
    // then works with the goalController object to update the given goal and the necessary
    // task within with the new data given. After, the user is navigated back to the task and
    // the current user's data is refreshed via getCurrentUser.
    updateTask(title, date, description, targetGoalId, targetTaskId, goal) {
        // Find goal and get task to update
        // let currGoalCat = this.state.goalData
        //     .filter((goalCat) => goalCat.id == targetGoalId)[0];
        let currGoal = goal
        let currTasks = currGoal.tasks;
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
        currGoal.tasks = currTasks;

        // Push it to the server
        this.props.goalController.updateGoal(this.state.currentGoalId, currGoal)
        .then((data) => {
            this.getCurrentUser();
            if (this.state.isServiceProvider) {
                this.props.history.push('/progress/provider/participants/goals/tasks/:id' + targetGoalId);
            } else {
                this.props.history.push('/progress/goals/:id' + targetGoalId);
            }
        });
    }

    render() {
        // ProgressController does not display any HTML itself, rather it organizes the various pieces of
        // state and passes all necessary data and functions to the Progress.js component, which further routes,
        // filters and displays the necessary componenents.
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
                            getSpecificGoal={ (goalId) => this.getSpecificGoal(goalId) }
                            handleSearch={ (e) => this.handleSearch(e) }
                            editTask={ (taskId) => this.editTask(taskId) }
                            markGoalActive={ (goalId) => this.markGoalActive(goalId) }
                            markGoalComplete={ (goalId) => this.markGoalComplete(goalId) }
                            markTaskActive={ (taskId, goal) => this.markTaskActive(taskId, goal) }
                            markTaskComplete={ (taskId, goal) => this.markTaskComplete(taskId, goal) }
                            refreshUser={ () => this.getCurrentUser() }
                            submitComment={ (comment, taskId, goal) => this.addTaskComment(comment, taskId, goal) }
                            submitResource={ (resourceName, resourceUrl, taskId, goal) => this.addTaskResource(resourceName, resourceUrl, taskId, goal) }
                            switchGoalNavFilter={ (e, t) => this.switchGoalNavFilter(e, t) }
                            switchTaskNavFilter={ (e, t) => this.switchTaskNavFilter(e, t) }
                            updateTask={ (title, date, description, targetGoalId, targetTaskId, goal) => this.updateTask(title, date, description, targetGoalId, targetTaskId, goal) }
                            updateGoal={ (goal) => this.updateGoal(goal) }
                            addBtnLink={ addBtnLink }
                            allGoals={ allGoals }
                            currUser={ currUser }
                            connections={ connections }
                            resourceCategories= {this.state.resourceCategories }
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
                            getResources={ (search) => this.getResources(search) }
                            deleteResourceCategory= { (id) => this.deleteResourceCategory(id) }
                        />
                    </div>
                )} />
            )
        } else { // If there is an error leading to a lack of state or user data, nothing is displayed.
            return <p></p>
        }
    }
}

export default withRouter(ProgressController);