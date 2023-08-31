// frontend/src/redux/sagas.js
import { takeLatest, put, call, all } from 'redux-saga/effects';
import apolloClient from '../apolloClient';
import { GET_CURRENT_USER } from '../gql/queries/GET_CURRENT_USER';
import { fetchUserRequest, fetchUserSuccess, fetchUserFailure } from './slices/userSlice';
import {
    fetchMessagesRequest,
    fetchMessagesSuccess,
    fetchMessagesFailure,
} from './slices/chatSlice';
import { GET_MESSAGES_BY_CHATROOM_ID } from "../gql/queries/GET_MESSAGES_BY_CHATROOM_ID";

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

// Worker saga for chat messages
function* fetchChatMessagesSaga(action) {
    yield put(fetchMessagesRequest());
    try {
        const { data } = yield call(apolloClient.query, {
            query: GET_MESSAGES_BY_CHATROOM_ID,
            variables: { chatRoomId: action.payload.chatRoomId }
        });
        yield put(fetchMessagesSuccess(data.getMessagesByChatRoomId));
    } catch (error) {
        yield put(fetchMessagesFailure(error.message));
    }
}

// Watcher saga for chat messages
export function* watchFetchChatMessages() {
    yield takeLatest('FETCH_MESSAGES_REQUEST', fetchChatMessagesSaga);
}

// Root saga
export default function* rootSaga() {
    yield all([
        watchFetchCurrentUser(),
        watchFetchChatMessages(),  // Existing watcher saga for chat messages
    ]);
}
