// authService/src/graphql/resolvers.js
const {login} = require('./mutations/login');
const {getCurrentUserCredentials} = require('./queries/getCurrentUser');

const resolvers = {

	Query: {
		getCurrentUserCredentials
	},

	Mutation: {
		login
	},
};

module.exports = {resolvers};