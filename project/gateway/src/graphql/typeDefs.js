// authService/src/graphql/typeDefs.js

const {gql} = require("apollo-server-express");

const typeDefs = gql`
    
    scalar Upload 

    type User {
        _id: ID!
        email: String!
        username: String!
    }

    type SignupPayload {
        token: String!
        user: User!
    }

    type LoginPayload {
        token: String!
        user: User!
    }

    type LogoutPayload {
        message: String!
    }
        
    type ChatRoomPopulated {
        _id: ID!
        participantIds: [User!]!
        messageIds: [ID]
        createdAt: String!
    }
    
    type Message {
        _id: ID!
        senderId: ID!
        body: String
        createdAt: String!
        chatRoomId: ID!
        fileContent: String # Base64 encoded file content
    }
    
    type MessagePopulated {
        _id: ID!
        senderId: User!
        body: String
        createdAt: String!
        chatRoomId: ID!
        fileContent: String # Base64 encoded file content
    }

    type Query {
        # authService
        getCurrentUserCredentials: User!
        # chatService
        getChatRoomById(chatRoomId: ID!): ChatRoomPopulated
        getMessagesByChatRoomId(chatRoomId: ID!): [MessagePopulated]
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
        changeUsername(newUsername: String!, currentPassword: String!): User
        logout: LogoutPayload!
        sendMessage(chatRoomId:ID!, body:String, file:Upload):Message!
    }
`;

module.exports = {typeDefs};
