// frontend/src/redux/store.js

import {configureStore} from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import {rehydrateState} from "./rehydrateState";
import rootSaga from "./sagas";
import createSagaMiddleware from "redux-saga";

const sagaMiddleware = createSagaMiddleware();

const initializeStore = async () => {
	const preloadedState = await rehydrateState();

	const optionalConfig = {
		devTools: process.env.NODE_ENV !== "production",
	};

	const store = configureStore({
		reducer: rootReducer, middleware: [sagaMiddleware], preloadedState, ...optionalConfig,
	});

	sagaMiddleware.run(rootSaga);

	return store;
};

export default initializeStore;
