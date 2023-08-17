// path: frontend/src/gql/mutations/SEND_MESSAGE.js
import gql from "graphql-tag";

export const SEND_MESSAGE = gql`
    mutation SendMessage($senderId: ID!, $chatRoomId: ID!, $body: String, $fileContent: String) {
        sendMessage(senderId: $senderId, chatRoomId: $chatRoomId, body: $body, fileContent: $fileContent) {
            id
            senderId
            chatRoomId
            body
            fileContent
            createdAt
        }
    }
`;
