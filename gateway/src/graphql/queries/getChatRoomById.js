const {AuthenticationError} = require('apollo-server-express');
const logger = require('../../utils/logger');

const getChatRoomById = async (_, {chatRoomId}, context) => {
	logger.debug("gateway/getChatRoomById");
    logger.debug(`gateway/chatRoomId: ${chatRoomId}`);
	const {token} = context;
	logger.debug(`gateway/token: ${token}`);
    if (!token) {
        throw new AuthenticationError('You need to be logged in');
    }

	const user = await context.dataSources.authAPI.getUserByToken(token);
	console.log(`gateway/user: ${JSON.stringify(user)}`);
	if (!user) {
        throw new AuthenticationError('Not user found');
    }

	const chatRoom = await context.dataSources.chatAPI.getChatRoomById(chatRoomId);

	if(!chatRoom) {
		logger.error(`Chat room not found: ${chatRoomId}`);
		throw new Error('Chat room not found');
	} else {
		logger.debug(`Chat room found: ${chatRoomId}`);
		logger.debug(`Chat room participants: ${chatRoom.participantIds}`);
	}

	const isChatRoomParticipant = chatRoom.participantIds.includes(user._id);

	if(!isChatRoomParticipant) {
		logger.error(`You are not a participant of this chat room: ${chatRoomId}`);
        throw new Error('You are not a participant of this chat room');
	}

	return await context.dataSources.chatAPI.getChatRoomByIdPopulatedWithUsers(chatRoomId);
}

module.exports = {getChatRoomById};