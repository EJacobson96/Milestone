import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App'; //import our component
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
    }
};

export default MessageController;