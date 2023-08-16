// frontend/src/actions.js

import { GET_CURRENT_USER } from './gql/queries/GET_CURRENT_USER';
import apolloClient from './apolloClient'; // Import your existing Apollo Client instance

// Defining constants for action types
export const SET_USER = 'SET_USER';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

// Action creators for user actions
export const setUser = user => ({ type: SET_USER, payload: user });
export const loginUser = () => ({ type: LOGIN_USER });
export const logoutUser = () => ({ type: LOGOUT_USER });
export const fetchUserRequest = () => ({ type: FETCH_USER_REQUEST });
export const fetchUserSuccess = user => ({ type: FETCH_USER_SUCCESS, payload: user });
export const fetchUserFailure = error => ({ type: FETCH_USER_FAILURE, payload: error });

// Thunk to fetch the current user's data
export const fetchCurrentUser = () => {
    return async (dispatch) => {
        // Dispatching the request action to indicate the start of the fetch
        dispatch(fetchUserRequest());

        try {
            // Making the GraphQL query to fetch the current user's data using your existing client
            const { data } = await apolloClient.query({ query: GET_CURRENT_USER });

            // Dispatching the success action with the fetched user data
            dispatch(fetchUserSuccess(data.getCurrentUser));
        } catch (error) {
            // Dispatching the failure action with the error message
            dispatch(fetchUserFailure(error.message));
        }
    };
};
