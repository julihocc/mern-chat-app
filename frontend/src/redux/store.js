// Importing required modules and utilities
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import { rehydrateState } from "./rehydrateState";

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
    return configureStore({
        // Root reducer containing all the application reducers
        reducer: rootReducer,

        // Initial state fetched through the rehydration process,
        // using `preloadedState`
        preloadedState,

        // Spreading optional configuration
        ...optionalConfig
    });
};

// Export the initialization function
export default initializeStore;
