const {gql} = require('apollo-server-express');

const typeDefs = gql`
	type User {
		id: ID!
        username: String!
        email: String!
        password: String!
	}
	
	type Query {
        getUserByEmail(email: String!): User!
    }	
`