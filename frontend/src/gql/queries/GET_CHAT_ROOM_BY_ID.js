import gql from "graphql-tag";

export const GET_CHAT_ROOM_BY_ID = gql`
  query GetChatRoomById($chatRoomId: ID!) {
    getChatRoomById(chatRoomId: $chatRoomId) {
      id
      participantIds {
        username
      }
      messageIds
      createdAt
    }
  }
`;
