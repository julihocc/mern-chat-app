import gql from "graphql-tag";

export const CHANGE_PASSWORD = gql`
    mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
        changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
            _id
            email
            username
        }
    }
`;
