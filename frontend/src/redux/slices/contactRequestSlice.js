// frontend/src/redux/slices/contactRequestSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apolloClient from "../../apolloClient";
import { SEND_CONTACT_REQUEST } from "../../gql/mutations/SEND_CONTACT_REQUEST";
import { GET_USER_BY_EMAIL } from "../../gql/queries/GET_USER_BY_EMAIL";

export const sendContactRequest = createAsyncThunk(
  "contact/sendContactRequest",
  async ({ senderId, recipientId }) => {
    const { data } = await apolloClient.mutate({
      mutation: SEND_CONTACT_REQUEST,
      variables: { senderId, recipientId },
    });
    return data;
  }
);

export const getUserByEmail = createAsyncThunk(
  "contact/getUserByEmail",
  async (email) => {
    const { data } = await apolloClient.query({
      query: GET_USER_BY_EMAIL,
      variables: { email },
    });
    return data;
  }
);

const contactRequestSlice = createSlice({
  name: "contact",
  initialState: {
    userByEmail: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserByEmail.fulfilled, (state, action) => {
        state.userByEmail = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUserByEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default contactRequestSlice.reducer;
