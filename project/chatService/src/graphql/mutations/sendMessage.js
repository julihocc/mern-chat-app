// Path: contactService/src/graphql/mutations/sendMessage.js
const ChatRoom = require("../../models/ChatRoomModel");
const Message = require("../../models/MessageModel");
const logger = require("../../utils/logger");
const {AuthenticationError} = require("apollo-server-express");
const {getUserFromToken} = require("../../utils/authentication");

const sendMessage = async (_, {chatRoomId, body, file}, context) => {
	const {token, pubSub} = context;
	if (!token) {
		throw new AuthenticationError("You must be logged in!");
	}
	logger.debug(`Token: ${token}`);

	const sender = await getUserFromToken(token);

	if (!sender) {
		throw new AuthenticationError("Invalid token!");
	}

	logger.debug(`Sender: ${JSON.stringify(sender)}`);

	const senderId = sender.id;

	if (!senderId) {
		throw new Error("Sender ID must be provided");
	}

	logger.debug(`Received sendMessage request with senderId: ${senderId}, chatRoomId: ${chatRoomId}, body: ${body}`,);

	let fileContent = null;
	if (file) {
		const {createReadStream} = await file;
		const stream = createReadStream();
		const chunks = [];
		for await (const chunk of stream) {
			chunks.push(chunk);
		}
		fileContent = Buffer.concat(chunks).toString("base64");
	}

	const chatRoom = await ChatRoom.findById(chatRoomId);
	if (!chatRoom) {
		logger.error("Chat room not found");
		throw new Error("Chat room not found");
	}

	const messageInput = {
		chatRoomId: chatRoom.id, senderId: sender.id, body: body, fileContent: fileContent,
	};

	console.log(`Message input: ${JSON.stringify(messageInput)}`);

	const message = new Message(messageInput);

	try {
		await message.save();
		logger.debug(`Message saved with id: ${message.id}`);
	} catch (err) {
		logger.error(`Failed to save message: ${err}`);
		throw new Error("Failed to save message");
	}

	chatRoom.messageIds.push(message.id);
	await chatRoom.save();

	pubSub.publish(`NEW_MESSAGE_${chatRoomId}`, {newMessage: message});

	return message;
};

module.exports = {sendMessage};
