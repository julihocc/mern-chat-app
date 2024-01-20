const logger = require("../../utils/logger");
const {AuthenticationError} = require("apollo-server");
const pubSub = require("../../utils/pubsub");

const acceptContactRequest = async (parent, {requestId}, context) => {
	logger.debug("Mutations | acceptContactRequest")
	logger.debug(`requestId: ${requestId})`)

	if (!requestId) {
		logger.error('Request ID is required')
		throw new AuthenticationError('Request ID is required')
	}

	const {token} = context;
	logger.debug(`token: ${token}`)

	if (!token) {
		logger.error(`You must be logged in to accept a contact request`)
		throw new AuthenticationError('You must be logged in to accept a contact request')
	}

	try {
		const user = await context.dataSources.authAPI.getUserByToken(token);
		logger.debug(`user: ${JSON.stringify(user)}`);
		if (!user) {
			logger.error(`Could not find user for contact request: ${token}`)
			throw new AuthenticationError(`Could not find user for contact request: ${token}`)
		}

		const contactRequest = await context.dataSources.contactAPI.getContactRequest(requestId);
		logger.debug(`contactRequest: ${JSON.stringify(contactRequest)}`);

		if (user._id !== contactRequest.recipientId.toString()) {
			logger.error(`You must be the recipient of the contact request to accept it`)
			throw new AuthenticationError(`You must be the recipient of the contact request to accept it`)
		}

		if (!contactRequest) {
			logger.error(`Could not find contact request: ${requestId}`)
			throw new AuthenticationError(`Could not find contact request: ${requestId}`)
		}

		const updatedContactRequest = await context.dataSources.contactAPI.acceptContactRequest(requestId);

		const senderId = updatedContactRequest.senderId;
		logger.debug(`senderId: ${senderId}`);

		const recipientId = updatedContactRequest.recipientId;
		logger.debug(`recipientId: ${recipientId}`);

		const chatRoom = await context.dataSources.chatAPI.createChatRoomWithParticipantIds([senderId, recipientId]);
		logger.debug(`chatRoom: ${JSON.stringify(chatRoom)}`);

		await context.dataSources.contactAPI.addChatRoomIdToContactRequest(requestId, chatRoom._id);
		await context.dataSources.authAPI.addContact(senderId, recipientId);
		await context.dataSources.authAPI.addContact(recipientId, senderId);

		pubSub.publish('NEW_CONTACT', {newContact: updatedContactRequest});
		pubSub.publish('NEW_CHAT_ROOM', {newChatRoom: chatRoom});

		return updatedContactRequest;
		
	} catch (error) {
		logger.error(`Mutations | acceptContactRequest | error: ${JSON.stringify(error)}`)
		throw new Error(`Mutations | acceptContactRequest | error: ${JSON.stringify(error)}`)
	}
}

module.exports = {acceptContactRequest}