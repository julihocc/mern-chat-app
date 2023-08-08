// path: frontend/src/gql/subscriptions/FILE_UPLOADED.js
import { gql } from '@apollo/client';

export const FILE_UPLOADED = gql`
    subscription FileUploaded($chatRoomId: ID!) {
        fileUploaded(chatRoomId: $chatRoomId) {
        fileUrl
    }
    }
`;
