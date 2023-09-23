import gql from "graphql-tag";

export const GET_CONTACT_REQUESTS_BY_CONTEXT = gql`
    query GetContactRequestsByContext {
        getContactRequestsByContext {
            sender
            recipient
            status
            createdAt
        }
    }
`;
