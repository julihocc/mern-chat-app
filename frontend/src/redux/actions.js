// frontend/src/redux/actions.js

import apolloClient from "../apolloClient";
import {
  GET_CURRENT_USER,
  GET_MESSAGES_BY_CHATROOM_ID,
  GET_CHAT_ROOM_BY_ID,
} from "../gql/queryHub";

import {
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,
} from "./slices/userSlice"; // Updated import path

import {
  fetchMessagesRequest,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  fetchChatRoomRequest,
  fetchChatRoomSuccess,
  fetchChatRoomFailure,
} from "./slices/chatSlice";

const handleGraphQLQuery = async (query, variables = {}) => {
  try {
    const { data } = await apolloClient.query({ query, variables });
    return [null, data];
  } catch (error) {
    return [error, null];
  }
};

export const fetchMessages = (chatRoomId) => async (dispatch) => {
  dispatch(fetchMessagesRequest());
  const [error, data] = await handleGraphQLQuery(GET_MESSAGES_BY_CHATROOM_ID, {
    chatRoomId,
  });

  if (error) {
    dispatch(fetchMessagesFailure(error.message));
  } else {
    dispatch(fetchMessagesSuccess(data.getMessagesByChatRoomId));
  }
};

export const fetchChatRoom = (chatRoomId) => async (dispatch) => {
  dispatch(fetchChatRoomRequest());
  const [error, data] = await handleGraphQLQuery(GET_CHAT_ROOM_BY_ID, {
    chatRoomId,
  });

  if (error) {
    dispatch(fetchChatRoomFailure(error.message));
  } else {
    dispatch(fetchChatRoomSuccess(data.getChatRoomById));
  }
};

export const fetchCurrentUser = () => async (dispatch) => {
  dispatch(fetchUserRequest());
  const [error, data] = await handleGraphQLQuery(GET_CURRENT_USER);

  if (error) {
    dispatch(fetchUserFailure(error.message));
  } else {
    dispatch(fetchUserSuccess(data.getCurrentUser));
  }
};
