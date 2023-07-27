// useChatRoomQuery.js
// Path: frontend\src\components\chatRoomViewerUtils\useChatRoomQuery.js
import gql from 'graphql-tag';

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

export const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        getCurrentUser {
            id
            email
        }
    }
`;
