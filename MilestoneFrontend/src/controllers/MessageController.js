import Axios from 'axios';

// Controller object for fetching data
var MessageController = {
    getMessages: function (search, id) {
        return Axios.get(
            'https://api.milestoneapp.org/conversations?id=' + id + '&q=' + search)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            }
            );
    },

    getSpecificConversation: function (id) {
        return Axios.get(
            'https://api.milestoneapp.org/conversations/?id=' + id)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            }
        );
    },

    postConversation: function (id, message, filteredUsers) {
        return Axios.post(
            'https://api.milestoneapp.org/conversations?id=' + id, 
            {
                Message: {
                    TextBody: message
                },
                Members: filteredUsers
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            }
        );
    },

    postMessage: function (userID, conversationID, input) {
        return Axios.post(
            'https://api.milestoneapp.org/messages?id=' + userID, 
            {
                id: conversationID,
                TextBody: input 
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

export default MessageController;