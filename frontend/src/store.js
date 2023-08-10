// frontend/src/store.js

// Importing the Redux Toolkit's configureStore function
import { configureStore } from '@reduxjs/toolkit';

// Importing the userReducer from the reducers file
import userReducer from './reducers';

// Defining the rootReducer object, which combines all the reducers in the application
// In this case, only the userReducer is included, but other reducers can be added as well
const rootReducer = {
    user: userReducer
    // other reducers can go here
};

// Calling the configureStore function to create the Redux store
// Passing the rootReducer object to the reducer option to configure the store's reducers
const store = configureStore({
    reducer: rootReducer
});

// Exporting the configured store, so it can be used in other parts of the application
export default store;
