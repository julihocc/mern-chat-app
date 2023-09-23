import gql from "graphql-tag";

export const GET_MESSAGES_BY_CHATROOM_ID = gql`
    query GetMessagesByChatRoomId($chatRoomId: ID!) {
        getMessagesByChatRoomId(chatRoomId: $chatRoomId) {
            sender{
                _id
            }
            chatRoom{
                _id
            }
            body
            fileContent
            createdAt
        }
    }
`;
