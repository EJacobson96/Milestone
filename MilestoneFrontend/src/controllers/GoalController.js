import Axios from 'axios';

// Controller object for fetching data
var GoalController = {
    getGoals: function (id, search) {
        return Axios.get(
            'https://api.milestoneapp.org/goals?id=' + id + '&q=' + search,
            {
                headers: {
                    'Authorization': localStorage.getItem('Authorization')
                }
            })
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
            'https://api.milestoneapp.org/resources?id=' + id,
            {
                headers: {
                    'Authorization': localStorage.getItem('Authorization')
                }
            })
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
            'https://api.milestoneapp.org/goals/?id=' + id,
            {
                headers: {
                    'Authorization': localStorage.getItem('Authorization')
                }
            })
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
            'https://api.milestoneapp.org/resources/?id=' + id,
            {
                headers: {
                    'Authorization': localStorage.getItem('Authorization')
                }
            })
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
            {
                headers: {
                    'Authorization': localStorage.getItem('Authorization')
                }, goal
            })
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
            {
                headers: {
                    'Authorization': localStorage.getItem('Authorization')
                }, currGoal
            })
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
            'https://api.milestoneapp.org/resources?id=' + resourceID,
            {
                headers: {
                    'Authorization': localStorage.getItem('Authorization')
                }
            })
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