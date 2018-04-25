import axios from 'axios';

export function fetchUser() {
    return function(dispatch) {
        Axios.get(
            'https://milestoneapi.eric-jacobson.me/users/me', 
            {
                headers: {
                    'Authorization' : localStorage.getItem('Authorization')
                }    
            })
            .then(response => {
                dispatch({type: "FETCH_USER_FULFILLED", payload: response.data})
            })
            .catch(error => {
                dispatch({type: "FETCH_USER_REJECTED", payload: error})
            }
        );
    }
}