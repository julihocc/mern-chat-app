import gql from "graphql-tag";

export const GET_USER_BY_ID = gql`
    query GetUserById($userId: ID!) {
        getUserById(userId: $userId) {
            _id
            email
            username
        }
    }
`;
