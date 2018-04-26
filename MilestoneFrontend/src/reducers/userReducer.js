export default function reducer(state={
    user: {
        id: null,
        email: null,
        firstName: null,
        lastName: null,
        fullName: null,
        photoURL: null,
        raceEthnicity: null,
        gender: null,
        dateOfBirth: null,
        phone: null,
        facebook: null,
        organization: null,
        program: null,
        availability: null,
        notifications: null,
        pendingRequests: null,
        connections: null,
        accountType: null,
        userStatus: null,
    }, 
    fetching: false,
    fetched: false,
    error: null,
    }, action) {

        switch (action.type) {
            case "FETCH_USER": {
                return {...state, fetching: true}
            }
            case "FETCH_USER_REJECTED": {
                return {...state, fetching: false, error: action.payload}
            }
            case "FETCH_USER_FULFILLED": {
                return {
                    ...state, 
                    fetching: true, 
                    fetched: true, 
                    user: action.payload
                }
            }
            default: 
                return state
        }
    return state
}