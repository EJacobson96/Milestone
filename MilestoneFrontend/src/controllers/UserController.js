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

    addConnection: function (id, userConnections) {
        return Axios.patch(
            'https://milestoneapi.eric-jacobson.me/connections?id=' + id, 
            {
                headers: {
                    'Authorization' : localStorage.getItem('Authorization')
                },
                Connections: userConnections
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

    postNotification: function (conversation, message) {
        return Axios.patch(
            'https://milestoneapi.eric-jacobson.me/notifications',
            {
                headers: {
                    'Authorization' : localStorage.getItem('Authorization')
                },
                Read: false,
                Body: message,
                ContentType: "new message",
                ContentID: conversation.id,
                Users: conversation.Users,
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
            'https://milestoneapi.eric-jacobson.me/sessions/mine',
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