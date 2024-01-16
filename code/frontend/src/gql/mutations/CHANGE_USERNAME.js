import gql from "graphql-tag";

export const CHANGE_USERNAME = gql`
    mutation ChangeUsername($newUsername: String!, $currentPassword: String!) {
        changeUsername(newUsername: $newUsername, currentPassword: $currentPassword) {
            username
        }
    }
`;
