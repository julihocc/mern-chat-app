// authService/src/graphql/resolvers.js
const {login} = require('./mutations/login');

const resolvers = {

	Query: {
        me: async (parent, args, context) => {
			return "me";
        }
	},

	Mutation: {
		login
	},
};

module.exports = {resolvers};