// contactService\src\graphql\resolvers\mutations\createChatRoom.js
const User = require("../../models/UserModel");
const ChatRoom = require("../../models/ChatRoomModel");
const {AuthenticationError} = require("apollo-server-express");
const {getUserFromToken} = require("../../utils/authentication");
const logger = require("../../utils/logger");
const {publishUserEvent} = require("../../utils/rabbitMQPublisher");
const createChatRoom = async (_, {participantIds}, context) => {
	const {token} = context;
	const user = await getUserFromToken(token);
	if (!user) {
		throw new AuthenticationError("You are not logged in");
	}

	const participants = await User.find({_id: {$in: participantIds}});

	if (participants.length !== participantIds.length) {
		throw new Error("Some participantIds not found");
	}

	const existingChatRoom = await ChatRoom.findOne({
		participantIds: {$all: participantIds},
	});
	if (existingChatRoom) {
		throw new Error("ChatRoom with these participants already exists");
	}

	try {
		const chatRoom = new ChatRoom({participantIds});
		await publishUserEvent("chatService", 'ChatRoomCreated', {
			id: chatRoom._id, participantIds: chatRoom.participantIds
		})
		await chatRoom.save();
		logger.debug(`Contact Service: Created chatRoom ${chatRoom._id}`);
		return chatRoom;
	} catch (error) {
		throw new Error(`Failed to create chatRoom: ${error.message}`);
	}
};

module.exports = {createChatRoom};
