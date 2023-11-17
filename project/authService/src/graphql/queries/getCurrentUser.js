const {AuthenticationError} = require("apollo-server-express");
const {getUserFromToken} = require("../../utils/authentication");
const {debug} = require("../../utils/logger");
const getCurrentUser = async (parent, args, context) => {
	const {token} = context;

	if (!token) {
		throw new AuthenticationError("You must be logged in");
	}

	debug(`Getting current user from token: ${token}`);

	const user = await getUserFromToken(token);

	if (!user) {
		throw new AuthenticationError("Invalid token");
	}

	return user;
};
module.exports = {getCurrentUser};
