import gql from "graphql-tag";

export const CREATE_GROUP_CONVERSATION = gql`
    mutation CreateGroupConversation($additionalEmails: [String!]!) {
        createGroupConversation(additionalEmails: $additionalEmails) {
            id
        }
    }
`;