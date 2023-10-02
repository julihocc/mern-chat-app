import gql from "graphql-tag";

export const CHANGE_USERNAME = gql`
    mutation ChangeUsername($newUsername: String!) {
        changeUsername(newUsername: $newUsername) {
            username
        }
    }
`
