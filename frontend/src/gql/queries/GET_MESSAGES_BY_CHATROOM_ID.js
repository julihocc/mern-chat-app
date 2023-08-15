import gql from "graphql-tag";

export const GET_MESSAGES_BY_CHATROOM_ID = gql`
    query GetMessagesByChatRoomId($chatRoomId: ID!) {
        getMessagesByChatRoomId(chatRoomId: $chatRoomId) {
            id
            senderId
            chatRoomId
            body
            fileUrl
            createdAt
        }
    }
`;