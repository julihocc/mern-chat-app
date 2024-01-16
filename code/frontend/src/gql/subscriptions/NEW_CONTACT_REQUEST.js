import gql from "graphql-tag";

export const NEW_CONTACT_REQUEST = gql`
subscription NewContactRequest {
  newContactRequest {
    id
  }
}
`;
