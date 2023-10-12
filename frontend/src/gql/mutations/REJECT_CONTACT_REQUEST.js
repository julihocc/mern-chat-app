import gql from "graphql-tag";

export const REJECT_CONTACT_REQUEST = gql`
  mutation RejectContactRequest($requestId: ID!) {
    rejectContactRequest(requestId: $requestId) {
      createdAt
      recipientId
      senderId
      status
    }
  }
`;
