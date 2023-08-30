// frontend/src/redux/sagas.js
import { takeLatest, put, call } from 'redux-saga/effects';
import apolloClient from '../apolloClient';
import { GET_CURRENT_USER } from '../gql/queries/GET_CURRENT_USER';
import { fetchUserRequest, fetchUserSuccess, fetchUserFailure } from './slices/userSlice';

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

// Watcher saga to capture dispatched actions of a particular type
export function* watchFetchCurrentUser() {
    yield takeLatest('FETCH_CURRENT_USER_SAGA', fetchCurrentUserSaga);
}
