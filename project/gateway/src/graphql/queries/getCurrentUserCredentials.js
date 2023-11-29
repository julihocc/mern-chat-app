const {AuthenticationError} = require("apollo-server-express");
const {debug} = require("../../utils/logger");
const getCurrentUserCredentials = async (parent, args, context) => {
	debug("queries/getCurrentUserCredentials");

	const {token} = context;
	debug("token:", token);

	if (!token) {
		throw new AuthenticationError("You must be logged in");
	}

	const user = await context.dataSources.authAPI.getUserByToken(token);
	debug("user:", user);

	if (!user) {
		throw new AuthenticationError("Invalid token");
	}

	return user;
};

module.exports = {getCurrentUserCredentials};
