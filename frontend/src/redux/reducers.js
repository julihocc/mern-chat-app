// frontend/src/redux/reducers.js

import { combineReducers } from "redux";
import userReducer from "./slices/userSlice"; // Import the new, merged reducer
import chatReducer from "./slices/chatSlice";
import imageReducer from "./slices/imageSlice";
import updateTriggerReducer from "./slices/updateTriggerSlice";
import contactReducer from "./slices/contactRequestSlice"

const rootReducer = combineReducers({
  user: userReducer, // Use the new, merged reducer here
  chat: chatReducer,
  image: imageReducer,
  updateTrigger: updateTriggerReducer,
  contact: contactReducer
});

export default rootReducer;
