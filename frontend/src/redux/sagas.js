// frontend/src/redux/sagas.js
import { takeLatest, put, call, all } from 'redux-saga/effects';
import apolloClient from '../apolloClient';
import { GET_CURRENT_USER } from '../gql/queries/GET_CURRENT_USER';
import {
    fetchUserRequest,
    fetchUserSuccess,
    fetchUserFailure,
    fetchUserSaga,
} from './slices/userSlice';

// Worker saga to fetch current user
function* fetchCurrentUserSaga() {
    yield put(fetchUserRequest());
    try {
        const { data } = yield call(apolloClient.query, { query: GET_CURRENT_USER });
        yield put(fetchUserSuccess(data.getCurrentUser));
    } catch (error) {
        yield put(fetchUserFailure(error.message));
    }
}


// Watcher saga to capture dispatched particular actions
function* watchFetchUserWithSagaAction() {
    yield takeLatest(fetchUserSaga.toString(), fetchCurrentUserSaga);
}

// Root saga
export default function* rootSaga() {
    yield all([
        watchFetchUserWithSagaAction(),  // New watcher saga for fetching user
    ]);
}
