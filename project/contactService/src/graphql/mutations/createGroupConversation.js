// contactService\src\graphql\resolvers\mutations\createGroupConversation.js
const User = require("../../models/UserModel");
const ChatRoom = require("../../models/ChatRoomModel");
const logger = require("../../utils/logger");
const {AuthenticationError} = require("apollo-server-express");
const {getUserFromToken} = require("../../utils/authentication");
const {publishUserEvent} = require("../../utils/rabbitMQPublisher");

const createGroupConversation = async (_, {additionalEmails}, context) => {
	logger.debug("createGroupConversation");
	const {token} = context;
	const user = await getUserFromToken(token);
	if (!user) {
		logger.error("Attempted unauthorized access.");
		throw new AuthenticationError("You must be logged in");
	}
	const otherUsers = await User.find({email: {$in: additionalEmails}});
	const users = [user, ...otherUsers];

	if (users.length === 0) {
		throw new Error("No users found");
	} else {
		for (let i = 0; i < users.length; i++) {
			logger.debug(`createGroupConversation: ${users[i].email}`);
		}
	}

	const participantIds = users.map((user) => user._id);

	const existingChatRoom = await ChatRoom.findOne({
		participantIds: {$all: participantIds},
	});
	if (existingChatRoom) {
		throw new Error("ChatRoom with these participants already exists");
	}

	const chatRoom = new ChatRoom({participantIds});
	if (!chatRoom) {
		throw new Error("Failed to create chatRoom");
	}

	try {
		await chatRoom.save();
		await publishUserEvent("chatService", 'ChatRoomCreated', {
			id: chatRoom._id, participantIds: chatRoom.participantIds
		})
		return chatRoom;
	} catch (error) {
		throw new Error(`Failed to create chatRoom: ${error.message}`);
	}
};

module.exports = {createGroupConversation};
