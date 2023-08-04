import gql from "graphql-tag";

export const SEND_CONTACT_REQUEST = gql`
    mutation SendContactRequest($senderId: ID!, $recipientId: ID!) {
        sendContactRequest(senderId: $senderId, recipientId: $recipientId) {
            senderId
            recipientId
            status
            createdAt
        }
    }
`;
