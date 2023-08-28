// frontend/src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import { rehydrateState } from "./rehydrateState";

// const store = configureStore({
//     reducer: rootReducer,
//     // Thunk middleware is included by default in configureStore
// });

// export default store;

const initializeStore = async () => {
  
  const initialState = await rehydrateState(); // Get the rehydrated state

  return configureStore({
    reducer: rootReducer,
    initialState, // Use the rehydrated state as initial state
  });
};

export default initializeStore;
