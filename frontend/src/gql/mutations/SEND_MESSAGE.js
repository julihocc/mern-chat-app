// path: frontend/src/gql/mutations/SEND_MESSAGE.js
import gql from "graphql-tag";

export const SEND_MESSAGE = gql`
    mutation SendMessage($senderId: ID!, $chatRoomId: ID!, $body: String, $file: Upload) {
        sendMessage(senderId: $senderId, chatRoomId: $chatRoomId, body: $body, file: $file) {
            id
            senderId
            chatRoomId
            body
            fileUrl
            createdAt
        }
    }
`;
