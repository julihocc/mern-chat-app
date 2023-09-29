import gql from "graphql-tag";

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