import apolloClient from '../apolloClient'; // Import your existing Apollo Client instance
import { GET_CURRENT_USER } from '../gql/queries/GET_CURRENT_USER';
import { GET_MESSAGES_BY_CHATROOM_ID } from '../gql/queries/GET_MESSAGES_BY_CHATROOM_ID';
import { GET_CHAT_ROOM_BY_ID } from '../gql/queries/GET_CHAT_ROOM_BY_ID'; // Make sure to define this query

export const actionType = {
    SET_USER: 'SET_USER',
    LOGIN_USER: 'LOGIN_USER',
    LOGOUT_USER: 'LOGOUT_USER',
    FETCH_USER_REQUEST: 'FETCH_USER_REQUEST',
    FETCH_USER_SUCCESS: 'FETCH_USER_SUCCESS',
    FETCH_USER_FAILURE: 'FETCH_USER_FAILURE',
    FETCH_MESSAGES_REQUEST: 'FETCH_MESSAGES_REQUEST',
    FETCH_MESSAGES_SUCCESS: 'FETCH_MESSAGES_SUCCESS',
    FETCH_MESSAGES_FAILURE: 'FETCH_MESSAGES_FAILURE',
    SEND_MESSAGE: 'SEND_MESSAGE',
    FETCH_CHAT_ROOM_REQUEST: 'FETCH_CHAT_ROOM_REQUEST',
    FETCH_CHAT_ROOM_SUCCESS: 'FETCH_CHAT_ROOM_SUCCESS',
    FETCH_CHAT_ROOM_FAILURE: 'FETCH_CHAT_ROOM_FAILURE'
}

// Thunk to fetch messages for a given chat room
export const fetchMessages = (chatRoomId) => {
    return async (dispatch) => {
        dispatch(fetchMessagesRequest());

        try {
            const { data } = await apolloClient.query({ query: GET_MESSAGES_BY_CHATROOM_ID, variables: { chatRoomId } });
            dispatch(fetchMessagesSuccess(data.getMessagesByChatRoomId));
        } catch (error) {
            dispatch(fetchMessagesFailure(error.message));
        }
    };
};


// Thunk to fetch chat room for a given chat room ID
export const fetchChatRoom = (chatRoomId) => {
    return async (dispatch) => {
        dispatch({ type: actionType.FETCH_CHAT_ROOM_REQUEST });

        try {
            const { data } = await apolloClient.query({ query: GET_CHAT_ROOM_BY_ID, variables: { chatRoomId } });
            dispatch({ type: actionType.FETCH_CHAT_ROOM_SUCCESS, payload: data.getChatRoomById });
        } catch (error) {
            dispatch({ type: actionType.FETCH_CHAT_ROOM_FAILURE, payload: error.message });
        }
    };
};

// Existing action creators for user actions
export const setUser = user => ({ type: actionType.SET_USER, payload: user });
export const loginUser = () => ({ type: actionType.LOGIN_USER });
export const logoutUser = () => ({ type: actionType.LOGOUT_USER });
export const fetchUserRequest = () => ({ type: actionType.FETCH_USER_REQUEST });
export const fetchUserSuccess = user => ({ type: actionType.FETCH_USER_SUCCESS, payload: user });
export const fetchUserFailure = error => ({ type: actionType.FETCH_USER_FAILURE, payload: error });

// Existing thunk to fetch current user's data
export const fetchCurrentUser = () => {
    return async (dispatch) => {
        dispatch(fetchUserRequest());

        try {
            const { data } = await apolloClient.query({ query: GET_CURRENT_USER });
            dispatch(fetchUserSuccess(data.getCurrentUser));
        } catch (error) {
            dispatch(fetchUserFailure(error.message));
        }
    };
};


// Existing action creators for fetching messages
export const fetchMessagesRequest = () => ({ type: actionType.FETCH_MESSAGES_REQUEST });
export const fetchMessagesSuccess = (messages) => ({ type: actionType.FETCH_MESSAGES_SUCCESS, payload: messages });
export const fetchMessagesFailure = (error) => ({ type: actionType.FETCH_MESSAGES_FAILURE, payload: error });

// Existing action creator for sending a message
export const sendMessage = (message) => ({ type: actionType.SEND_MESSAGE, payload: message });
