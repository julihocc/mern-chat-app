// frontend/src/redux/store.js

// Importing required modules and utilities
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import { rehydrateState } from "./rehydrateState";
import rootSaga from "./sagas";
import createSagaMiddleware from "redux-saga"; // Importing Redux Saga middleware

// Initialize Redux Saga middleware
const sagaMiddleware = createSagaMiddleware();

// Function to initialize the Redux store
const initializeStore = async () => {
  // Rehydrate initial state from persistent storage
  const preloadedState = await rehydrateState();

  // Optional Redux configurations, fetched from environment variables
  const optionalConfig = {
    devTools: process.env.NODE_ENV !== "production",
  };

  // Configure and create Redux store
  const store = configureStore({
    reducer: rootReducer, // Root reducer
    middleware: [sagaMiddleware], // Redux Saga middleware
    preloadedState, // Initial state
    ...optionalConfig, // Spreading optional configurations
  });

  // Run the root saga
  sagaMiddleware.run(rootSaga);

  return store;
};

// Export the store initialization function
export default initializeStore;
