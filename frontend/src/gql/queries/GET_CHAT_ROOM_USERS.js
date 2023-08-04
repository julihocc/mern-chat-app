import gql from "graphql-tag";

export const GET_CHAT_ROOM_USERS = gql `
    query GetChatRoomUsers($chatRoomId: ID!) {
        getChatRoomUsers(chatRoomId: $chatRoomId) {
            id
            username
            email
        }
    }
`;
