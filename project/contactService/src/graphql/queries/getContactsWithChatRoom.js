const logger = require("../../utils/logger");
const User = require("../../models/UserModel");
const {getUserFromToken} = require("../../utils/authentication");
const {AuthenticationError} = require("apollo-server-express");
const ChatRoom = require("../../models/ChatRoomModel");

const getContactsWithChatRoom = async (parent, args, context) => {
	const {token} = context;
	if (!token) {
		throw new AuthenticationError("You must be logged in to get contacts");
	}
	const user = await getUserFromToken(token);
	if (!user) {
		throw new AuthenticationError("You must be logged in to get contacts");
	}
	const contacts = await User.find({_id: {$in: user.contacts}}).populate("contacts",);
	for (let contact of contacts) {
		logger.debug(`Contact: ${JSON.stringify(contact.id)}`);
		const chatRoom = await ChatRoom.findOne({
			participantIds: {
				$all: [user.id, contact.id], $size: 2,
			},
		});
		logger.debug(`Chat room: ${JSON.stringify(chatRoom.id)}`);
		contact.chatRoom = chatRoom.id;
	}
	return contacts;
};

module.exports = {getContactsWithChatRoom};
