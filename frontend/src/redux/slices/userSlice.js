// frontend/src/redux/slices/userSlice.js

import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialUserState = {
  loading: false,
  user: null,
  isLoggedIn: false,
  error: null,
};

// Creating the slice
const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    // Action for setting the user
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    // Action for user login
    loginUser: (state) => {
      state.isLoggedIn = true;
    },
    // Action for user logout
    logoutUser: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    // Action for fetching user (Request)
    fetchUserRequest: (state) => {
      state.loading = true;
    },
    // Action for fetching user (Success)
    fetchUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
      state.isLoggedIn = true;
    },
    // Action for fetching user (Failure)
    fetchUserFailure: (state, action) => {
      state.loading = false;
      state.user = null;
      state.error = action.payload;
      state.isLoggedIn = false;
    },
  },
});

// Export actions and the reducer
export const {
  setUser,
  loginUser,
  logoutUser,
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,
} = userSlice.actions;

console.log(userSlice.actions)

export const selectCurrentUser = (state) => state.user.user;

export default userSlice.reducer;
