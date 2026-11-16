const logger = require("../../utils/logger");
const getContactRequests = async (_: any, {userId}: any, context: any) => {
	logger.debug(`GateWay | Queries | getContactRequests | userId: ${userId}`)

	const user = context.dataSources.authAPI.getUserById(userId);
	logger.debug(`GateWay | Queries | getContactRequests | user: ${JSON.stringify(user)}`)

	if (!user) {
		throw new Error("User not found");
	}

	try {
		const contactRequests = await context.dataSources.contactAPI.getContactRequestsByRecipientId(userId);
		logger.debug(`GateWay | Queries | getContactRequests | contactRequest: ${JSON.stringify(contactRequests)}`)
		return contactRequests;

	} catch (err: any) {
		logger.error("Error loading contact requests: ", err); // Log the error
		throw new Error("Error fetching contact requests");
	}
};
module.exports = {getContactRequests};
