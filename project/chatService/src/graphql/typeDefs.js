// backend\src\graphql\typeDefs.js

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

    type Query {
	    getChatRoomById(chatRoomId: ID!): ChatRoomPopulated
	    getMessagesByChatRoomId(chatRoomId: ID!): [MessagePopulated]
    }

    type Mutation {
        sendMessage(chatRoomId: ID!, body: String, file: Upload): Message!
    }

    type Subscription {
        newMessage(chatRoomId: ID!): Message!
    }
`;

module.exports = { typeDefs };
