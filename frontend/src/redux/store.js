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
		devTools: import.meta.env.MODE !== "production",
	};

	const store = configureStore({
		reducer: rootReducer, middleware: [sagaMiddleware], preloadedState, ...optionalConfig,
	});

	sagaMiddleware.run(rootSaga);

	return store;
};

export default initializeStore;
