import gql from 'graphql-tag';

export const GET_CONTACTS_WITH_FULL_DETAILS  = gql`
    query GetContactsWithFullDetails{
        getContactsWithFullDetails{
            id
            email
            username
        }
    }
`;
