const { UserInputError } = require("apollo-server-express");

const getMessagesByChatRoomId = async (parent, args, context) => {
	const { chatRoomId } = args;
	const messages = await context.dataSources.chatAPI.getMessagesByChatRoomId(chatRoomId);
	if (!messages) {
		throw new UserInputError('No messages found');
	}
	return messages;
}

module.exports = {getMessagesByChatRoomId};