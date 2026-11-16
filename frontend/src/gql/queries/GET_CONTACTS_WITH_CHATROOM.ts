import gql from "graphql-tag";

export const GET_CONTACTS_WITH_CHATROOM = gql`
  query GetContactsWithChatRoom {
    getContactsWithChatRoom {
      _id
      email
      username
      chatRoom
    }
  }
`;
