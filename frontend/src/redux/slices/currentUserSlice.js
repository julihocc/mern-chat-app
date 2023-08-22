// frontend/src/redux/slices/currentUserSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialCurrentUserState = {
    loading: false,
    user: null,
    error: null,
};

const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState: initialCurrentUserState,
    reducers: {
        fetchUserRequest: (state) => { state.loading = true; },
        fetchUserSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
            state.isLoggedIn = true;
        },
        fetchUserFailure: (state, action) => {
            state.loading = false;
            state.user = null;
            state.error = action.payload;
            state.isLoggedIn = false;
        },
        logout: (state) => {
            state.loading = false;
            state.user = null;
            state.error = null;
            state.isLoggedIn = false;
        }
    }
});

export const { fetchUserRequest, fetchUserSuccess, fetchUserFailure, logout } = currentUserSlice.actions;
export default currentUserSlice.reducer;
