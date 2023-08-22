// frontend/src/redux/reducers.js
import { combineReducers } from 'redux';
import userReducer from './slices/userSlice';
import currentUserReducer from './slices/currentUserSlice';
import chatReducer from './slices/chatSlice';

const rootReducer = combineReducers({
    user: userReducer,
    currentUser: currentUserReducer,
    chat: chatReducer
});

export default rootReducer;
