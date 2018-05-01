import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App'; //import our component
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
            }
            );
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
            }
            );
    }
};

export default UserController;