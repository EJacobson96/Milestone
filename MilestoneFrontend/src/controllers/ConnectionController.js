import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App'; //import our component
import Axios from 'axios';

// Controller object for fetching data
var ConnectionController = {
    getContact: function (id) {
        return Axios.get(
            'https://api.milestoneapp.org/contact/?id=' + id, 
            {
                headers: {
                    'Authorization' : localStorage.getItem('Authorization')
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

export default ConnectionController;