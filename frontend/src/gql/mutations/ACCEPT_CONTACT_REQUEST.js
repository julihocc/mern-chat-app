import gql from "graphql-tag";

export const ACCEPT_CONTACT_REQUEST = gql`
    mutation AcceptContactRequest($requestId: ID!) {
        acceptContactRequest(requestId: $requestId) {
            createdAt
            recipientId
            senderId
            status
        }
    }
`;
