const logger = require("../../utils/logger");
const {AuthenticationError} = require("apollo-server-express");


const getContactsWithChatRoom = async (parent, args, context) => {
	logger.debug("gateway | Mutations | getContactsWithChatRoom")
	const {token} = context;
	logger.debug(`token: ${token}`);
	if (!token) {
		throw new AuthenticationError("You must be logged in to get contacts");
	}
	// const user = await getUserFromToken(token);
	const user = await context.dataSources.authAPI.getUserByToken(token);
	logger.debug(`gateway | getContactsWithChatRoom | user: ${JSON.stringify(user)}`);

	if (!user) {
		throw new AuthenticationError("You must be logged in to get contacts");
	}

	// const contacts = await User.find({_id: {$in: user.contacts}}).populate("contacts",);
	const contacts = await context.dataSources.authAPI.getContactsByUserId(user._id);
	logger.debug(`gateway | getContactsWithChatRoom | data: ${JSON.stringify(contacts)}`);
	logger.debug(`type of contacts: ${typeof contacts}`);

	for (let contact of contacts) {
		logger.debug(`Contact: ${JSON.stringify(contact._id)}`);
		// const chatRoom = await ChatRoom.findOne({
		// 	participantIds: {
		// 		$all: [user.id, contact.id], $size: 2,
		// 	},
		// });
		const chatRoom = await context.dataSources.chatAPI.getChatRoomByParticipantIds([user._id, contact._id]);
		logger.debug(`Chat room: ${JSON.stringify(chatRoom._id)}`);
		contact.chatRoom = chatRoom._id;
	}
	return contacts;
};

module.exports = {getContactsWithChatRoom};
