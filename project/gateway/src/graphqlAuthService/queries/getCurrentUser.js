const {AuthenticationError} = require("apollo-server-express");
const getCurrentUserCredentials = async (parent, args, context) => {
	const {token} = context;

	if (!token) {
		throw new AuthenticationError("You must be logged in");
	}

	const user = await context.dataSources.authAPI.getUserByToken(token);

	if (!user) {
		throw new AuthenticationError("Invalid token");
	}

	return user;
};

module.exports = {getCurrentUserCredentials};
