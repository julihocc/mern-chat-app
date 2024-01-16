const logger = require("../../utils/logger");
const {AuthenticationError} = require('apollo-server-express');
const getChatRoomsForCurrentUser = async (parent, args, context) => {
	logger.debug("gateway | getChatRoomsForCurrentUser");
	const {token} = context;
	logger.debug(`gateway | getChatRoomsForCurrentUser | token: ${token}`);
	if (!token) {
		throw new AuthenticationError("gateway | getChatRoomsForCurrentUser | Not authenticated");
	}

	const user = await context.dataSources.authAPI.getUserByToken(token);
	logger.debug(`gateway | getChatRoomsForCurrentUser | user: ${JSON.stringify(user)}`);
	if (!user) {
        logger.error("gateway | getChatRoomsForCurrentUser | User not found");
    }

	// const chatRooms = await ChatRoom.find({participantIds: user._id});
	const chatRooms = await context.dataSources.chatAPI.getChatRoomsByUserId(user._id);
	logger.debug(`gateway | getChatRoomsForCurrentUser | chatRooms: ${JSON.stringify(chatRooms)}`)

	if (!chatRooms) {
		logger.error("Chat rooms not found");
	}
	return chatRooms;
};

module.exports = {getChatRoomsForCurrentUser};
