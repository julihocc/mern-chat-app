// store.js

// Import the necessary modules
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

// Import the root reducer
// You'll create this file in the next step
import rootReducer from './reducers';

// Create the store
const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);

export default store;
