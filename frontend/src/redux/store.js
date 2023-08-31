// frontend/src/redux/store.js
// Importing required modules and utilities
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import { rehydrateState } from "./rehydrateState";
import rootSaga from "./sagas";
import createSagaMiddleware from 'redux-saga';  // <--
// Make sure this line exists

// Configure middleware
const sagaMiddleware = createSagaMiddleware();
// Function to initialize the Redux store
const initializeStore = async () => {
    // Rehydrate state from local storage or other persistent layers
    const preloadedState = await rehydrateState();

    // Optional Redux configurations, fetched from environment variables
    const optionalConfig = {
        devTools: process.env.NODE_ENV !== 'production',
        // Add more configurations here as needed
    };

    // Configuring and creating Redux store
    const store = configureStore({
        // Root reducer containing all the application reducers
        reducer: rootReducer,
        middleware: [sagaMiddleware],

        // Initial state fetched through the rehydration process,
        // using `preloadedState`
        preloadedState,

        // Spreading optional configuration
        ...optionalConfig
    });

    // Run sagas
    sagaMiddleware.run(rootSaga);

    return store;
};

// Export the initialization function
export default initializeStore;
