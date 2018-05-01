import Axios from 'axios';

// Controller object for fetching data
var MessageController = {
    getMessages: function (search, id) {
        return Axios.get(
            'https://milestoneapi.eric-jacobson.me/conversations?id=' + id + '&q=' + search,
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

    postConversation: function (id, message, filteredUsers) {
        return Axios.post(
            'https://milestoneapi.eric-jacobson.me/conversations?id=' + this.props.user.id, 
            {
                headers: {
                    'Authorization' : localStorage.getItem('Authorization')
                },
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
};

export default MessageController;