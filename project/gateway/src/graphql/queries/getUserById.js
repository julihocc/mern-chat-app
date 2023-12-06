const logger = require("../../utils/logger");

const getUserById = async (_, {userId}, context) => {
	logger.debug(`GateWay | Queries | getUserByEmail | userId: ${userId}`);

	const user = await context.dataSources.authAPI.getUserById(userId);
	// logger.debug(`user: ${JSON.stringify(user)}`);
	logger.debug(`GateWay | Queries | getUserByEmail | user: ${JSON.stringify(user)}`);

	if (!user) {
		logger.error(`No user with id: ${userId}`);
		throw new Error(`No user with id: ${userId}`);
	}

	return user;
}

module.exports = {getUserById};