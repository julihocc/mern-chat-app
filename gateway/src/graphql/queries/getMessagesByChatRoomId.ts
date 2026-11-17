const {UserInputError, AuthenticationError} = require("../../utils/graphqlErrors");
const {debug} = require("winston");

const getMessagesByChatRoomId = async (parent: any, args: any, context: any) => {
	debug("Gateway | Queries | getMessagesByChatRoomId");
	const {chatRoomId} = args;
	debug(`Gateway | Queries | getMessagesByChatRoomId | chatRoomId: ${chatRoomId} `)
	if (!chatRoomId) {
		throw new UserInputError("Chat room id is required");
	}
	if (!context.token) {
		throw new AuthenticationError("You need to be logged in");
	}
	const user = await context.dataSources.authAPI.getUserByToken(context.token);
	if (!user) {
		throw new AuthenticationError("Not user found");
	}
	const room = await context.dataSources.chatAPI.getChatRoomById(chatRoomId);
	const participantIds = (room && room.participantIds) || [];
	const isParticipant = participantIds.some((id: any) => String(id && id._id ? id._id : id) === String(user._id));
	if (!isParticipant) {
		throw new AuthenticationError("You are not a participant of this chat room");
	}
	const messages = await context.dataSources.chatAPI.getMessagesByChatRoomId(chatRoomId);
	debug(`Gateway | Queries | getMessagesByChatRoomId | messages: ${messages} `)
	return messages;
}

module.exports = {getMessagesByChatRoomId};