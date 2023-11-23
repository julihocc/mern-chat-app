// authService/src/graphql/resolvers.js
const {login} = require('./mutations/login');
const {getCurrentUserCredentials} = require('./queries/getCurrentUser');
const {signUp} = require('./mutations/signUp');
const {changePassword} = require('./mutations/changePassword');

const resolvers = {

	Query: {
		getCurrentUserCredentials
	},

	Mutation: {
		login, signUp, changePassword
	},
};

module.exports = {resolvers};