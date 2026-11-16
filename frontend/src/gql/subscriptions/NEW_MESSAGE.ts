// path: src/graphql/subscriptions/NEW_MESSAGE_SUBSCRIPTION.js
import gql from "graphql-tag";

export const NEW_MESSAGE = gql`
  subscription NewMessage($chatRoomId: ID!) {
    newMessage(chatRoomId: $chatRoomId) {
      _id
      senderId
      chatRoomId
      body
      fileContent
      createdAt
    }
  }
`;
