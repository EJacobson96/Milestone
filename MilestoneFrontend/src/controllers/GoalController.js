import Axios from 'axios';

// Controller object for fetching data regarding goals for Milestone's 'Progress' functionality
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

    getResources: function (id) {
        return Axios.get(
            'https://api.milestoneapp.org/resources?id=' + id)
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

    getSpecificResource: function (id) {
        return Axios.get(
            'https://api.milestoneapp.org/resources/?id=' + id)
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

    updateGoal: function (targetGoalId, currGoal) {
        return Axios.patch(
            'https://api.milestoneapp.org/goals?id=' + targetGoalId,
            currGoal)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error(error);
            }
        );
    },

    deleteResourceCategory: function (resourceID) {
        return Axios.delete(
            'https://api.milestoneapp.org/resources?id=' + resourceID)
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