import gql from "graphql-tag";

export const SIGNUP = gql`
    mutation SignUp(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        signUp(
            username: $username
            email: $email
            password: $password
            confirmPassword: $confirmPassword
        ) {
            token
            user {
                _id
                username
                email
            }
        }
    }
`;