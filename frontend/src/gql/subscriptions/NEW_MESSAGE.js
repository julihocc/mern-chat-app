// path: src/graphql/subscriptions/NEW_MESSAGE_SUBSCRIPTION.js
import gql from "graphql-tag";

export const NEW_MESSAGE = gql`
  subscription NewMessage{
    newMessage{
      _id
      senderId
      chatRoomId
      body
      fileContent
      createdAt
    }
  }
`;
