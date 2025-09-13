import gql from "graphql-tag";

export const SEND_CONTACT_REQUEST = gql`
  mutation SendContactRequest($recipientId: ID!) {
    sendContactRequest(recipientId: $recipientId) {
      senderId
      recipientId
      status
      createdAt
    }
  }
`;
