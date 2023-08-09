// frontend/src/actions.js

// Defining a constant for the action type
// This helps in maintaining consistency and avoids typo errors
export const SET_USER = 'SET_USER';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';


// Action creator for setting the user
// This function takes a user object and returns an action with the type 'SET_USER'
// The user object is included as the payload of the action
export const setUser = user => ({ type: SET_USER, payload: user });
export const loginUser = () => ({ type: LOGIN_USER });
export const logoutUser = () => ({ type: LOGOUT_USER });
