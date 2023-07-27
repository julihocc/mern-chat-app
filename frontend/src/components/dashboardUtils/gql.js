// path: frontend\src\components\dashboardUtils\SendContactRequest\gql.js
import { gql } from '@apollo/client';

const SEND_CONTACT_REQUEST = gql`
    mutation SendContactRequest($senderId: ID!, $recipientId: ID!) {
        sendContactRequest(senderId: $senderId, recipientId: $recipientId) {
            id
            senderId
            recipientId
            status
            createdAt
        }
    }
`;

const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        getCurrentUser {
            id
            email
        }
    }
`;

const GET_USER_BY_EMAIL = gql`
    query GetUserByEmail($email: String!) {
        getUserByEmail(email: $email) {
            id
            email
        }
    }
`;

export { SEND_CONTACT_REQUEST, GET_CURRENT_USER, GET_USER_BY_EMAIL };
