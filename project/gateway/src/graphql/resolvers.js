// authService/src/graphql/resolvers.js
// const {changePassword} = require('./mutations/changePassword');
// const {login} = require('./mutations/login');
// const {signUp} = require('./mutations/signUp');
// const {changeUsername} = require('./mutations/changeUsername');
// const {logout} = require('./mutations/logout');

const resolvers = {

	Query: {
		getCurrentUser: async (parent, args, {dataSources, context}) => {
			console.log(context);
			return await dataSources.authAPI.getCurrentUser();
		}
	},

	Mutation: {
		login: async (_, {email, password}, {dataSources}) => {
			console.log("Mutation: login");
			console.log(email, password);
			console.log(dataSources)
			return await dataSources.authAPI.login(email, password);
		}
	},
};

module.exports = {resolvers};