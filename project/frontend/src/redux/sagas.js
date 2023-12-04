// frontend/src/redux/sagas.js
import {all, call, put, takeLatest} from "redux-saga/effects";
import {apolloClient} from "../apolloClient";
import {GET_CURRENT_USER} from "../gql/queries/GET_CURRENT_USER";
import {fetchUserFailure, fetchUserRequest, fetchUserSaga, fetchUserSuccess,} from "./slices/userSlice";

function* fetchCurrentUserSaga() {
	yield put(fetchUserRequest());
	try {
		const {data} = yield call(apolloClient.query, {
			query: GET_CURRENT_USER,
		});
		yield put(fetchUserSuccess(data.getCurrentUser));
	} catch (error) {
		yield put(fetchUserFailure(error.message));
	}
}

function* watchFetchUserWithSagaAction() {
	yield takeLatest(fetchUserSaga.toString(), fetchCurrentUserSaga);
}

export default function* rootSaga() {
	yield all([watchFetchUserWithSagaAction(),]);
}
