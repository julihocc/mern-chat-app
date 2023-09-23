// frontend/src/gql/queries/GET_CURRENT_USER.js

import gql from "graphql-tag";

export const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        getCurrentUser {
            _id
            email
            username
            contacts{
                _id
            }
        }
    }
`;
