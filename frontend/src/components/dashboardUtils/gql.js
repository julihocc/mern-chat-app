// path: frontend\src\components\dashboardUtils\gql.js
import { gql } from '@apollo/client';

export const SEND_CONTACT_REQUEST = gql`
    mutation SendContactRequest($senderId: ID!, $recipientId: ID!) {
        sendContactRequest(senderId: $senderId, recipientId: $recipientId) {
            id
            senderId
            recipientId
            status
            createdAt
        }
    }
`;

export const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        getCurrentUser {
            id
            email
        }
    }
`;

export const GET_USER_BY_EMAIL = gql`
    query GetUserByEmail($email: String!) {
        getUserByEmail(email: $email) {
            id
            email
        }
    }
`;

export const GET_CHAT_ROOMS = gql`
    query GetChatRooms {
        getChatRooms{
            id
            participantIds
            messageIds
        }
    }
`;

export const GET_USERS_BY_ID = gql`
    query GetUsersById($userIds: [ID!]!) {
        getUsersById(userIds: $userIds) {
            id
            email
        }
    }
`;

export const GET_CONTACTS = gql`
    query GetContacts($userId: ID!) {
        getContacts(userId: $userId) {
            id
        }
    }
`;


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
