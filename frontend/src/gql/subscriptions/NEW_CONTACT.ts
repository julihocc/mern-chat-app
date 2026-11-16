import gql from "graphql-tag";

export const NEW_CONTACT = gql`
subscription NewContact {
  newContact {
    _id
  }
}
`;