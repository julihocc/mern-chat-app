const logger = require("../../utils/logger");
const {AuthenticationError} = require("apollo-server-express");

const rejectContactRequest = async (parent, {requestId}, context) => {
	logger.debug(`Mutations | rejectContactRequest`)
	logger.debug(`requestId: ${requestId}`)
	if (!requestId) {
        logger.error('Request ID is required')
        throw new AuthenticationError('Request ID is required')
    }

	const {token} = context;
	logger.debug(`token: ${token}`)
	if (!token) {
		logger.error(`You must be logged in to reject a contact request`)
        throw new AuthenticationError('You must be logged in to reject a contact request')
	}

	try {
		const user = await context.dataSources.authAPI.getUserByToken(token)
		logger.debug(`user: ${JSON.stringify(user)}`)
		if (!user) {
			logger.error(`Could not find user for contact request: ${token}`)
			throw new AuthenticationError(`Could not find user for contact request: ${token}`)
		}

		const contactRequest = await context.dataSources.contactAPI.getContactRequest(requestId)
		logger.debug(`contactRequest: ${JSON.stringify(contactRequest)}`)
		if (!contactRequest) {
			logger.error(`Could not find contact request: ${requestId}`)
			throw new AuthenticationError(`Could not find contact request: ${requestId}`)
		}

		if (user._id !== contactRequest.recipientId.toString()) {
			logger.error(`You must be the recipient of the contact request to reject it`)
			throw new AuthenticationError(`You must be the recipient of the contact request to reject it`)
		}

		const updatedContactRequest = await context.dataSources.contactAPI.rejectContactRequest(requestId)
		logger.debug(`updatedContactRequest: ${JSON.stringify(updatedContactRequest)}`)

		return updatedContactRequest
	} catch (error) {
		logger.error(`Mutations | rejectContactRequest | error: ${JSON.stringify(error)}`)
        throw new Error(`Mutations | rejectContactRequest | error: ${JSON.stringify(error)}`)
	}
}

module.exports = {rejectContactRequest}