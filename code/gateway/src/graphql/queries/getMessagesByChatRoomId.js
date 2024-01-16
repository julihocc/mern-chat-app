const {UserInputError} = require("apollo-server-express");
const {debug} = require("winston");

const getMessagesByChatRoomId = async (parent, args, context) => {
	debug("Gateway | Queries | getMessagesByChatRoomId");
	const {chatRoomId} = args;
	debug(`Gateway | Queries | getMessagesByChatRoomId | chatRoomId: ${chatRoomId} `)
	if (!chatRoomId) {
		throw new UserInputError("Chat room id is required");
	}
	const messages = await context.dataSources.chatAPI.getMessagesByChatRoomId(chatRoomId);
	debug(`Gateway | Queries | getMessagesByChatRoomId | messages: ${messages} `)
	return messages;
}

module.exports = {getMessagesByChatRoomId};