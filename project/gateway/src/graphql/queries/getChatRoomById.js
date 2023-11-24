const {AuthenticationError} = require('apollo-server-express');
const logger = require('../../utils/logger');

const getChatRoomById = async (_, {chatRoomId}, context) => {
	const {token} = context;

    if (!token) {
        throw new AuthenticationError('You need to be logged in');
    }

	const user = context.dataSources.authAPI.getUserByToken(token);
	logger.debug(`User found: ${user.email} (${user.id})`);
	if (!user) {
        throw new AuthenticationError('Not user found');
    }

	const chatRoom = await context.dataSources.chatAPI.getChatRoomById(chatRoomId);
}

module.exports = {getChatRoomById};