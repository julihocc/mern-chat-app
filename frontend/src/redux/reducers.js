// frontend/src/redux/reducers.js
import { combineReducers } from "redux";
import userReducer from "./slices/userSlice"; // Import from the new userSlice

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer, // Use the new userSlice
});

export default rootReducer;
