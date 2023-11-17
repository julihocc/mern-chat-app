// authService/src/graphql/typeDefs.js

const {gql} = require("apollo-server-express");

const typeDefs = gql`

    type User @key(fields: "id"){
        id: ID!
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

    type Query {
	    getCurrentUser: User!
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
    }
`;

module.exports = {typeDefs};
