import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App'; //import our component
import Axios from 'axios';

// Controller object for fetching data
var GoalController = {
    getGoals: function (id, search) {
        return Axios.get(
            'https://api.milestoneapp.org/goals?id=' + id + '&q=' + search)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            }
        );
    },

    getSpecificGoal: function (id) {
        return Axios.get(
            'https://api.milestoneapp.org/goals/?id=' + id)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            }
        );
    },

    addGoal: function (goal) {
        return Axios.post(
            'https://api.milestoneapp.org/goals',
            goal)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            }
        ); 
    },

    updateGoal: function (targetGoalId, currGoalCat) {
        return Axios.patch(
            'https://api.milestoneapp.org/goals?id=' + targetGoalId,
            currGoalCat)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error(error);
            }
        );
    },

};

export default GoalController;