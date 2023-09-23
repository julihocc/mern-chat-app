import gql from "graphql-tag";

export const SEND_CONTACT_REQUEST = gql`
    mutation SendContactRequest($recipientEmail: String!) {
        sendContactRequest(recipientEmail: $recipientEmail) {
            sender
            recipient
            status
            createdAt
        }
    }
`;
