// frontend/src/redux/slices/userSlice.js
import {createSlice} from "@reduxjs/toolkit";

const initialState = {
	user: null as any,
	isLoggedIn: false,
	loading: false,
	error: null as string | null,
	_id: null as string | null,
	email: null as string | null,
	username: null as string | null,
};

const userSlice = createSlice({
	name: "user", initialState, reducers: {
		fetchUserSaga: (state, action) => {
		}, setUser: (state, action) => {
			const profile = action.payload || null;
			state.user = profile;
			state.isLoggedIn = Boolean(profile);
			state._id = profile?._id ?? null;
			state.email = profile?.email ?? null;
			state.username = profile?.username ?? null;
			state.loading = false;
			state.error = null;
		}, logoutUser: (state) => {
			state.isLoggedIn = false;
			state.user = null;
			state._id = null;
			state.email = null;
			state.username = null;
		}, fetchUserRequest: (state) => {
			state.loading = true;
		}, fetchUserSuccess: (state, action) => {
			state.loading = false;
			state.user = action.payload;
			state.error = null;
			state.isLoggedIn = true;
		}, fetchUserFailure: (state, action) => {
			state.loading = false;
			state.user = null;
			state.error = action.payload;
			state.isLoggedIn = false;
		}, setUserUsername: (state, action) => {
			state.username = action.payload;
			if (state.user) {
				state.user.username = action.payload;
			}
		},
	},
});

export const {
	fetchUserSaga, setUser, logoutUser, fetchUserRequest, fetchUserSuccess, fetchUserFailure, setUserUsername,
} = userSlice.actions;

// Exporting the reducer
export default userSlice.reducer;
