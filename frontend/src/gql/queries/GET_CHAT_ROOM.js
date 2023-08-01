import gql from "graphql-tag";

export const GET_CHAT_ROOM = gql`
    query GetChatRoom($chatRoomId: ID!) {
        getChatRoom(chatRoomId: $chatRoomId) {
            id
            participantIds
            messageIds
        }
    }
`;
