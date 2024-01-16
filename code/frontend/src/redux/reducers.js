// frontend/src/redux/reducers.js
import {combineReducers} from "redux";
import userReducer from "./slices/userSlice";

// Combine reducers
const rootReducer = combineReducers({
	user: userReducer,
});

export default rootReducer;
