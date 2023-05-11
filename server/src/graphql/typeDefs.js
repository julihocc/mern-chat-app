const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        id: ID!
        email: String!
    }

    type ChatRoom {
        id: ID!
        participantIds: [ID!]!
        messagesIds: [ID]
    }

    type Message {
        id: ID!
        senderId: ID!
        body: String!
        createdAt: String!
        chatRoomId: ID!
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
        status: String!
        createdAt: String!
    }

    type Mutation {
        signUp(email: String!, password: String!): SignupPayload!
        login(email: String!, password: String!): LoginPayload!
        sendMessage(senderId:ID!, chatRoomId: ID!,  body: String!): Message!
        sendContactRequest(senderId: ID!, recipientId:ID!): ContactRequest
        acceptContactRequest(senderId: ID!, recipientId:ID!): ContactRequest!
        rejectContactRequest(senderId: ID!, recipientId:ID!): ContactRequest!
        createChatRoom(participantIds: [ID!]!): ChatRoom!
        createGroupConversation(emails: [String!]!): ChatRoom!
    }

    type Subscription {
        messageAdded(chatRoomId: ID!): Message!
    }
`;

module.exports = typeDefs;
