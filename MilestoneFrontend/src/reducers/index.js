import { combineReducers } from 'redux';

import user from './userReducer';
import session from './sessionReducer';



export default combineReducers({
    session,
    user,
})