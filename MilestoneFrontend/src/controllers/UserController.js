import Axios from 'axios';

// Controller object for fetching data
var UserController = {
    getUser: function () {
        return Axios.get(
            'https://api.milestoneapp.org/users/me',
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
            'https://api.milestoneapp.org/connections?q=' + search + "&id=" + id,
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
            'https://api.milestoneapp.org/contact/?id=' + id,
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
            'https://api.milestoneapp.org/' + userType + '?q=' + searchQuery,  
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
            'https://api.milestoneapp.org/connections?id=' + id, 
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
            'https://api.milestoneapp.org/requests?id=' + id,
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
        return Axios.patch(
            'https://api.milestoneapp.org/notifications?id=' + id,
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

    logOut: function () {
        Axios.delete(
            'https://api.milestoneapp.org/sessions/mine',
            {
                headers: {
                    'Authorization' : localStorage.getItem('Authorization')
                }
            })
            .then(response => {

                localStorage.removeItem('Authorization', response.headers.authorization);
                // if (response.status < 300) {
                //     localStorage.setItem('Authorization', response.headers("Authorization"));
                // }
                // console.log(response);
                return response.data;
            })
            .catch(error => {
                console.log(error);
            }
        );
    }
};

export default UserController;