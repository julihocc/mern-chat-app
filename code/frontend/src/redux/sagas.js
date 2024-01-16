// frontend/src/redux/sagas.js
import {all, call, put, takeLatest} from "redux-saga/effects";
import {apolloClient} from "../apolloClient";
import {GET_CURRENT_USER} from "../gql/queries/GET_CURRENT_USER";
import {fetchUserFailure, fetchUserRequest, fetchUserSaga, fetchUserSuccess,} from "./slices/userSlice";
import logger from "../utils/logger";

function* fetchCurrentUserSaga() {
	logger.debug("Fetching current user...");
	yield put(fetchUserRequest());
	try {
		logger.debug("Fetching current user...");
		const {data} = yield call(apolloClient.query, {
			query: GET_CURRENT_USER,
		});
		logger.debug("Fetched current user:", data.getCurrentUser);
		yield put(fetchUserSuccess(data.getCurrentUser));
	} catch (error) {
		logger.error("Error fetching current user:", error.message);
		yield put(fetchUserFailure(error.message));
	}
}

function* watchFetchUserWithSagaAction() {
	yield takeLatest(fetchUserSaga.toString(), fetchCurrentUserSaga);
}

export default function* rootSaga() {
	yield all([watchFetchUserWithSagaAction(),]);
}
