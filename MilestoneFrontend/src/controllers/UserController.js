import Axios from 'axios';

// Controller object for fetching data
var UserController = {
    getUser: function () {
        return Axios.get(
            'https://milestoneapi.eric-jacobson.me/users/me',
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
            });
    },

    getUserConnections: function (search, id) {
        return Axios.get(
            'https://milestoneapi.eric-jacobson.me/connections?q=' + search + "&id=" + id,
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
            });
    },

    getContact: function (id) {
        return Axios.get(
            'https://milestoneapi.eric-jacobson.me/contact/?id=' + id,
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
            });
    },

    searchForConnections: function (userType, searchQuery) {
        return Axios.get(
            'https://milestoneapi.eric-jacobson.me/' + userType + '?q=' + searchQuery,  
            {
                // headers: {
                //     'Authorization' : localStorage.getItem('Authorization')
                // }    
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            }
        );
    },

    addConnection: function (id, connections) {
        return Axios.patch(
            'https://milestoneapi.eric-jacobson.me/connections?id=' + id, 
            {
                // headers: {
                //     'Authorization' : localStorage.getItem('Authorization')
                // },
                Connections: connections
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            }
        );
    },

    updateUserRequests: function (id, requests) {
        // console.log(id);
        return Axios.patch(
            'https://milestoneapi.eric-jacobson.me/requests?id=' + id,
            {
                // headers: {
                //     'Authorization' : localStorage.getItem('Authorization')
                // }
                PendingRequests: requests
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            });
        
    },

    postNotification: function (notifications, id) {
        console.log(notifications + " " + id);
        return Axios.patch(
            'https://milestoneapi.eric-jacobson.me/notifications?id=' + id,
            {
                // headers: {
                //     'Authorization' : localStorage.getItem('Authorization')
                // },
                Notifications: notifications
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            }
        );
    },

};

export default UserController;