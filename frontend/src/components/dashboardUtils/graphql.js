// Path: frontend\src\components\dashboardUtils\graphql.js
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
    mutation AcceptContactRequest($requestId: ID!) {
        acceptContactRequest(requestId: $requestId) {
            createdAt
            id
            recipientId
            senderId
            status
        }
    }
`;

export const REJECT_CONTACT_REQUEST = gql`
    mutation RejectContactRequest($requestId: ID!) {
        rejectContactRequest(requestId: $requestId) {
            createdAt
            id
            recipientId
            senderId
            status
        }
    }
`;
