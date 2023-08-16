import apolloClient from './apolloClient'; // Import your existing Apollo Client instance
import { GET_CURRENT_USER } from './gql/queries/GET_CURRENT_USER';
import { GET_MESSAGES_BY_CHATROOM_ID } from './gql/queries/GET_MESSAGES_BY_CHATROOM_ID';
import { GET_CHAT_ROOM_BY_ID } from './gql/queries/GET_CHAT_ROOM_BY_ID'; // Make sure to define this query

// Constants for user action types
export const SET_USER = 'SET_USER';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

// Constants for message action types
export const FETCH_MESSAGES_REQUEST = 'FETCH_MESSAGES_REQUEST';
export const FETCH_MESSAGES_SUCCESS = 'FETCH_MESSAGES_SUCCESS';
export const FETCH_MESSAGES_FAILURE = 'FETCH_MESSAGES_FAILURE';
export const SEND_MESSAGE = 'SEND_MESSAGE';

// Constants for chat room action types
export const FETCH_CHAT_ROOM_REQUEST = 'FETCH_CHAT_ROOM_REQUEST';
export const FETCH_CHAT_ROOM_SUCCESS = 'FETCH_CHAT_ROOM_SUCCESS';
export const FETCH_CHAT_ROOM_FAILURE = 'FETCH_CHAT_ROOM_FAILURE';

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
        dispatch({ type: FETCH_CHAT_ROOM_REQUEST });

        try {
            const { data } = await apolloClient.query({ query: GET_CHAT_ROOM_BY_ID, variables: { chatRoomId } });
            dispatch({ type: FETCH_CHAT_ROOM_SUCCESS, payload: data.getChatRoomById });
        } catch (error) {
            dispatch({ type: FETCH_CHAT_ROOM_FAILURE, payload: error.message });
        }
    };
};

// Existing action creators for user actions
export const setUser = user => ({ type: SET_USER, payload: user });
export const loginUser = () => ({ type: LOGIN_USER });
export const logoutUser = () => ({ type: LOGOUT_USER });
export const fetchUserRequest = () => ({ type: FETCH_USER_REQUEST });
export const fetchUserSuccess = user => ({ type: FETCH_USER_SUCCESS, payload: user });
export const fetchUserFailure = error => ({ type: FETCH_USER_FAILURE, payload: error });

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
export const fetchMessagesRequest = () => ({ type: FETCH_MESSAGES_REQUEST });
export const fetchMessagesSuccess = (messages) => ({ type: FETCH_MESSAGES_SUCCESS, payload: messages });
export const fetchMessagesFailure = (error) => ({ type: FETCH_MESSAGES_FAILURE, payload: error });

// Existing action creator for sending a message
export const sendMessage = (message) => ({ type: SEND_MESSAGE, payload: message });
