// frontend/src/redux/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Initial state declaration
const initialState = {
    user: null,
    isLoggedIn: false,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // New action for Saga to listen to (for fetching user)
        fetchUserSaga: (state, action) => {
            // This will be empty as the saga will handle the side-effects
        },
        // Reducer for setting the user and marking as logged in
        setUser: (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;  // Mark user as logged in
        },
        // Reducer for logging out the user
        logoutUser: (state) => {
            state.isLoggedIn = false;
            state.user = null;
        },
        // Reducer for initiating a user fetch request
        fetchUserRequest: (state) => {
            state.loading = true;
        },
        // Reducer for handling user fetch success
        fetchUserSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
            state.isLoggedIn = true;
        },
        // Reducer for handling user fetch failure
        fetchUserFailure: (state, action) => {
            state.loading = false;
            state.user = null;
            state.error = action.payload;
            state.isLoggedIn = false;
        },
    },
});

// Exporting action creators
export const {
    fetchUserSaga, // New action for Saga to listen to
    setUser,  // Only setUser remains, loginUser is removed
    logoutUser,
    fetchUserRequest,
    fetchUserSuccess,
    fetchUserFailure,
} = userSlice.actions;

// Exporting the reducer
export default userSlice.reducer;
