// path: frontend\src\components\dashboardUtils\gql.js
import gql from 'graphql-tag';

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

export const GET_CONTACT_REQUESTS_BY_CONTEXT = gql`
    query GetContactRequestsByContext {
        getContactRequestsByContext {
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
            recipientId
            senderId
            status
        }
    }
`;


export const GET_CHAT_ROOM = gql`
    query GetChatRoom($chatRoomId: ID!) {
        getChatRoom(chatRoomId: $chatRoomId) {
            id
            participantIds
            messageIds
        }
    }
`;

export const GET_MESSAGES_BY_CHAT_ROOM_ID = gql`
    query GetMessagesByChatRoomId($chatRoomId: ID!) {
        getMessagesByChatRoomId(chatRoomId: $chatRoomId) {
            id
            senderId
            chatRoomId
            body
            createdAt
        }
    }
`;

export const SEND_MESSAGE = gql`
    mutation SendMessage($senderId: ID!, $chatRoomId: ID!, $body: String!, $file: Upload) {
        sendMessage(senderId: $senderId, chatRoomId: $chatRoomId, body: $body, file: $file) {
            id
            senderId
            chatRoomId
            body
            imageUrl
            createdAt
        }
    }
`;



export const GET_USER_BY_ID = gql`
    query GetUserById($userId: ID!) {
        getUserById(userId: $userId) {
            id
            email
            username
        }   
    }
`;

export const GET_MESSAGES_BY_CHATROOM_ID = gql`
    query GetMessagesByChatRoomId($chatRoomId: ID!) {
        getMessagesByChatRoomId(chatRoomId: $chatRoomId) {
            id
            senderId
            chatRoomId
            body
            imageUrl
            createdAt
        }
    }
`;

export const NEW_MESSAGE_SUBSCRIPTION = gql`
    subscription NewMessageSubscription($chatRoomId: ID!) {
        newMessage(chatRoomId: $chatRoomId) {
            id
            senderId
            chatRoomId
            body
            imageUrl
            createdAt
        }
    }
`;

export const GET_USERS_BY_IDS = gql`
    query GetUsersByIds($userIds: [ID!]!) {
        getUsersById(userIds: $userIds) {
            id
            email
        }
    }
`;

export const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        getCurrentUser {
            id
            email
            username
            contacts
        }
    }
`;
