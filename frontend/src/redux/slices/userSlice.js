// frontend/src/redux/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialUserState = {
    user: null,
    isLoggedIn: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState: initialUserState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;
        },
        loginUser: (state) => {
            state.isLoggedIn = true;
        },
        logoutUser: (state) => {
            state.isLoggedIn = false;
            state.user = null;
        },
    }
});

export const { setUser, loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
