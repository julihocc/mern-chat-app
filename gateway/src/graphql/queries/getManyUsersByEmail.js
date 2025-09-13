const logger = require("../../utils/logger");

const getManyUsersByEmail = async (_, {emails}, context) => {
	logger.debug("queries/getUserByEmail", {emails});

	const users = await context.dataSources.authAPI.getManyUsersByEmail(emails);
	logger.debug(`user: ${JSON.stringify(users)}`);

	if (!users) {
		logger.error(`No user with email: ${emails}`);
		throw new Error(`No user with email: ${emails}`);
	}

	return users;
}

module.exports = {getManyUsersByEmail};