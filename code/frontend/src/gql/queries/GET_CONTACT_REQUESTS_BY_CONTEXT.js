import gql from "graphql-tag";

export const GET_CONTACT_REQUESTS_BY_CONTEXT = gql`
  query GetContactRequestsByContext {
    getContactRequestsByContext {
      _id
      senderId {
        _id
        username
        email
      }
      recipientId
      status
      createdAt
    }
  }
`;
