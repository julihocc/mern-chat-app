import gql from "graphql-tag";

export const NEW_CHAT_ROOM = gql`
  subscription NewChatRoom {
    newChatRoom {
      _id
    }
  }
`;
