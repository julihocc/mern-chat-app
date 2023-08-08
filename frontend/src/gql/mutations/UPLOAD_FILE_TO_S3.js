// path: frontend/src/gql/mutations/UPLOAD_FILE_TO_S3.js
import { gql } from '@apollo/client';

export const UPLOAD_FILE_TO_S3 = gql`
    mutation UploadFileToS3($file: Upload!, $chatRoomId: ID!) {
        uploadFileToS3(file: $file, chatRoomId: $chatRoomId) {
            fileUrl
        }
    }
`;
