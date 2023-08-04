import gql from "graphql-tag";

export const GET_USERS_BY_ID = gql`
    query GetUsersById($userIds: [ID!]!) {
        getUsersById(userIds: $userIds) {
            id
            email
            username
        }
    }
`;
