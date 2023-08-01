import gql from "graphql-tag";

export const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        getCurrentUser {
            id
            email
            username
            contacts
        }
    }
`;
