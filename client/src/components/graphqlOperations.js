import {gql} from '@apollo/client';

export const GET_CONTACT_REQUESTS = gql`
    query GetContactRequests($userId: ID!) {
        getContactRequests(userId: $userId) {
            id
            senderId
            recipientId
            status
            createdAt
        }
    }
`;

export const ACCEPT_CONTACT_REQUEST = gql`
    mutation AcceptContactRequest($senderId: ID!, $recipientId: ID!) {
        acceptContactRequest(senderId: $senderId, recipientId: $recipientId) {
            createdAt
            id
            recipientId
            senderId
            status
        }
    }
`;

export const REJECT_CONTACT_REQUEST = gql`
    mutation RejectContactRequest($senderId: ID!, $recipientId: ID!) {
        rejectContactRequest(senderId: $senderId, recipientId: $recipientId) {
            createdAt
            id
            recipientId
            senderId
            status
        }
    }
`;
