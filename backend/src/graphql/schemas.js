// backend\src\graphql\schemas.js

const { gql } = require('apollo-server-express');

const schemas = gql`
    scalar Upload

    type User {
        id: ID!
        email: String!
        username: String!
        contacts: [ID] # new field
    }


    type ChatRoom {
        id: ID!
        participantIds: [ID!]!
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

    type Query {
        getMessagesByChatRoomId(chatRoomId: ID!): [MessagePopulated]
        getChatRooms: [ChatRoom]
        getCurrentUser: User
        getUserById(userId: ID!): User
        getContactRequests(userId: ID!): [ContactRequest] # modified
        getContactRequestsByContext: [ContactRequest] # new
        getChatRoomById(chatRoomId: ID!): ChatRoom
        getUserByEmail(email: String!): User
        getChatRoomsByUserId(userId: ID!): [ChatRoom]
        getMessageById(messageId: ID!): Message
        getUsersById(userIds: [ID!]!): [User]
        getUserByEmails(emails: [String!]!): [User]
        getContacts(userId: ID!): [User]
        getContactsWithFullDetails: [User]
        getChatRoomUsers(chatRoomId: ID!): [User]
        getChatRoomsForCurrentUser: [ChatRoom]
    }

    type Mutation {
        signUp(email: String!, username: String!, password: String!, confirmPassword: String!): SignupPayload!
        login(email: String!, password: String!): LoginPayload!
        sendMessage(senderId:ID!, chatRoomId: ID!,  body: String,  file: Upload): Message!
        sendContactRequest(senderId: ID!, recipientId:ID!): ContactRequest
        acceptContactRequest(requestId: ID!): ContactRequest!
        rejectContactRequest(requestId: ID!): ContactRequest!
        createChatRoom(participantIds: [ID!]!): ChatRoom!
        createGroupConversation(emails: [String!]!): ChatRoom!
    }

    type Subscription {
        newMessage(chatRoomId: ID!): Message!
        friendRequestUpdated(userId: ID!): ContactRequest!  # new subscription
    }
`;

module.exports = schemas;
