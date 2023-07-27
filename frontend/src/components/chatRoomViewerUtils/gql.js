import {gql} from "@apollo/client";

const NEW_MESSAGE_SUBSCRIPTION = gql`
    subscription OnNewMessage($chatRoomId: ID!) {
        newMessage(chatRoomId: $chatRoomId) {
            id
            body
            senderId
        }
    }
`;

const GET_MESSAGES_BY_CHATROOM_ID = gql`
    query GetMessagesByChatRoomId($chatRoomId: ID!) {
        getMessagesByChatRoomId(chatRoomId: $chatRoomId) {
            id
            body
            senderId
        }
    }
`;

const GET_USER_BY_ID = gql`
    query GetUserById($userId: ID!) {
        getUserById(userId: $userId) {
            id
            email
        }
    }
`;

const GET_USERS_BY_IDS = gql`
    query GetUsersById($userIds: [ID!]!) {
        getUsersById(userIds: $userIds) {
            id
            email
        }
    }
`;

export { GET_MESSAGES_BY_CHATROOM_ID, GET_USER_BY_ID, GET_USERS_BY_IDS, NEW_MESSAGE_SUBSCRIPTION }
