// path: frontend/src/gql/mutations/SEND_MESSAGE.js
import gql from "graphql-tag";
export const SEND_MESSAGE = gql`
    mutation SendMessage($senderId: ID!, $chatRoomId: ID!, $body: String, $fileContent: String) {
        sendMessage(senderId: $senderId, chatRoomId: $chatRoomId, body: $body, fileContent: $fileContent) {
            _id
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
