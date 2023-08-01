import gql from "graphql-tag";

export const GET_CONTACTS = gql`
    query GetContacts($userId: ID!) {
        getContacts(userId: $userId) {
            id
        }
    }
`;
