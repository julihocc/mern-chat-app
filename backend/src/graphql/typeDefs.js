// backend\src\graphql\typeDefs.js

const { gql } = require('apollo-server-express');

const typeDefs = gql`
    scalar Upload
    
    type User {
        id: ID!
        email: String!
        username: String!
        contacts: [User]! # new field
    }
    
    # ContactRequest Status Enum
    enum ContactRequestStatus {
        PENDING
        ACCEPTED
        REJECTED
    }
    
    type ChatRoom {
        id: ID!
        participantIds: [ID!]!
        messageIds: [ID]
    }

    type Message {
        id: ID!
        senderId: ID!
        body: String!
        createdAt: String!
        chatRoomId: ID!
        imageUrl: String
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
        senderId: ID!
        recipientId: ID!
        status: ContactRequestStatus! # updated field
        createdAt: String!
    }

    type Query {
        getMessagesByChatRoomId(chatRoomId: ID!): [Message]
        getChatRooms: [ChatRoom]
        getCurrentUser: User
        getUserById(userId: ID!): User
        getContactRequests(userId: ID!): [ContactRequest]
        getChatRoom(chatRoomId: ID!): ChatRoom
        getUserByEmail(email: String!): User
        getChatRoomsByUserId(userId: ID!): [ChatRoom]
        getMessageById(messageId: ID!): Message
        getUsersById(userIds: [ID!]!): [User]
        getUserByEmails(emails: [String!]!): [User]
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

module.exports = typeDefs;
