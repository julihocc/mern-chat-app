// path: frontend/src/gql/mutations/SEND_MESSAGE.js
import gql from "graphql-tag";

export const SEND_MESSAGE = gql`
  mutation SendMessage($chatRoomId: ID!, $body: String, $file: Upload) {
    sendMessage(chatRoomId: $chatRoomId, body: $body, file: $file) {
      _id
      senderId
      chatRoomId
      body
      fileContent
      createdAt
    }
  }
`;
