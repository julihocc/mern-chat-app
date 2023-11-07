// authService/src/graphql/typeDefs.js

const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Upload

  type User {
    id: ID!
    email: String!
    username: String!
    contacts: [ID]
  }

  type Contact {
    id: ID!
    email: String!
    username: String!
    chatRoom: ID
  }

  type ChatRoom {
    id: ID!
    participantIds: [ID!]!
    messageIds: [ID]
    createdAt: String!
  }

  type ChatRoomPopulated {
    id: ID!
    participantIds: [User!]!
    messageIds: [ID]
    createdAt: String!
  }

  type Message {
    id: ID!
    senderId: ID!
    body: String
    createdAt: String!
    chatRoomId: ID!
    fileContent: String # Base64 encoded file content
  }

  type MessagePopulated {
    id: ID!
    senderId: User!
    body: String
    createdAt: String!
    chatRoomId: ID!
    fileContent: String # Base64 encoded file content
  }

  type SignupPayload {
    token: String!
    user: User!
  }

  type LoginPayload {
    token: String!
    user: User!
  }

  type ContactRequest {
    id: ID!
    senderId: ID! # modified
    recipientId: ID!
    status: String!
    createdAt: String!
  }

  type ContactRequestPopulated {
    id: ID!
    senderId: User
    recipientId: ID!
    status: String!
    createdAt: String!
  }

  type Mutation {
    signUp(
      email: String!
      username: String!
      password: String!
      confirmPassword: String!
    ): SignupPayload!
    login(email: String!, password: String!): LoginPayload!
    changePassword(oldPassword: String!, newPassword: String!): User
  }
`;

module.exports = { typeDefs };
