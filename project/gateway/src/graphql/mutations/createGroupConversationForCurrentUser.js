const logger = require('../../utils/logger');
const {AuthenticationError} = require('apollo-server-express');
const {publishUserEvent} = require("../../utils/rabbitMQPublisher");

const createGroupConversationForCurrentUser = async (_, args, context) => {
	const {additionalEmails} = args;
	logger.debug(`additionalEmails: ${additionalEmails}`);
	const {token} = context;
	const user = await context.dataSources.authAPI.getUserByToken(token);
	if (!user) {
		logger.error(`user not found`);
		throw new AuthenticationError("Invalid token");
	}
	const otherUsers = await context.dataSources.authAPI.getManyUsersByEmail(additionalEmails);
	const users = [user, ...otherUsers];

	if (users.length === 0) {
		logger.error(`No users found`);
		throw new Error("No users found");
	} else {
		for (let i = 0; i < users.length; i++) {
			logger.debug(`users[${i}]: ${JSON.stringify(users[i])}`)
		}
	}

	const participantIds = users.map((user) => user._id);

	const existingChatRoom = await context.dataSources.chatAPI.getChatRoomByParticipantIds(participantIds);

	if (existingChatRoom) {
		logger.debug(`existingChatRoom: ${JSON.stringify(existingChatRoom)}`);
		throw new Error("Chat room already exists");
	}

	try {
		const chatRoom = await context.dataSources.chatAPI.createChatRoomWithParticipantIds(participantIds);
		logger.debug(`chatRoom: ${JSON.stringify(chatRoom)}`);
		return chatRoom;
	} catch (err) {
		logger.error(`Error creating chat room: ${err}`);
		throw new Error("Error creating chat room");
	}
}

module.exports = {createGroupConversationForCurrentUser};
