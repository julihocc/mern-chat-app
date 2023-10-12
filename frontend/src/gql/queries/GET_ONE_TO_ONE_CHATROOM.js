import gql from "graphql-tag";

export const GET_ONE_TO_ONE_CHATROOM = gql`
  query GetOneToOneChatRoom($contactId: ID) {
    getOneToOneChatRoom(contactId: $contactId) {
      id
    }
  }
`;
