const logger = require("../../utils/logger");
const {AuthenticationError} = require("apollo-server-express");

const sendMessage = async (parent, args, context) => {
	logger.debug(`Sending message: ${JSON.stringify(args)}`);

	const {token} = context

	const {chatRoomId, body, file} = args;

	if (!token) {
		throw new AuthenticationError("You must be logged in to send a message");
	}

	logger.debug(`Token: ${token}`);

	const sender = await context.dataSources.authAPI.getUserByToken(token);

	if (!sender) {
		throw new AuthenticationError("There is no user associated with this token");
	}

	logger.debug(`Sender: ${JSON.stringify(sender)}`);

	const senderId = sender._id;
	logger.debug(`Sender ID: ${senderId}`);

	if (!senderId) {
		throw new Error("Sender ID not found");
	}

	// let fileContent = null;
	//
	// if(file){
	// 	const {createReadStream} = await file;
	// 	const stream = createReadStream();
	// 	const chunks = [];
	// 	for await (const chunk of stream) {
	// 		chunks.push(chunk);
	// 	}
	// 	fileContent = Buffer.concat(chunks).toString("base64");
	// }

	let fileContent = null;

	if(file) {
		fileContent = file.split(";base64,")[1];
	}

	const chatRoom = await context.dataSources.chatAPI.getChatRoomById(chatRoomId)

	if(!chatRoom) {
		logger.error(`Could not find chat room with id: ${chatRoomId}`);
		throw new Error(`Could not find chat room with id: ${chatRoomId}`);
	}

	if (!chatRoom.participantIds.includes(senderId)) {
		throw new AuthenticationError("You are not authorized to send messages in this chat room");
	}

	// const messageInput = {
	// 	chatRoomId: chatRoom._id,
	// 	senderId: sender._id,
	// 	body: body,
	// 	fileContent: fileContent
	// }
	//
	// logger.debug(`Message input: ${JSON.stringify(messageInput)}`);

	// const message = await context.dataSources.chatAPI.saveMessage({
	// 	chatRoomId: chatRoom._id,
    //     senderId: sender._id,
    //     body,
    //     fileContent
	// })

	const message = await context.dataSources.chatAPI.saveMessage(
		chatRoomId,
        senderId,
        body,
        fileContent,
	)

	logger.debug(`Message: ${JSON.stringify(message._id)}`);

	return message;
}

module.exports = {sendMessage};