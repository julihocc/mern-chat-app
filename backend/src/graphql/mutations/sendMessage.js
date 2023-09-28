// Path: backend/src/graphql/mutations/sendMessage.js
const mongoose = require('mongoose'); // Import mongoose
const ChatRoom = require("../../models/ChatRoomModel");
const Message = require("../../models/MessageModel");
const logger = require('../../logger');
const User = require('../../models/UserModel');
const {AuthenticationError} = require("apollo-server-express");

const sendMessage = async (_, { senderId, chatRoomId, body, file }, context) => {

    const {token, pubSub} = context
    if (!token) {
        throw new AuthenticationError("You must be logged in!")
    }

    // Log the inputs without fileUrl, as it's not defined yet
    logger.info(`Received sendMessage request with senderId: ${senderId}, chatRoomId: ${chatRoomId}, body: ${body}`);

    // Handle file upload if provided
    let fileContent = null;
    if (file) {
        const { createReadStream } = await file;
        const stream = createReadStream();
        const chunks = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        fileContent = Buffer.concat(chunks).toString('base64');
        // Convert the file content to Base64
    }

    // Existing logic for sending a message
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
        logger.error("Chat room not found"); // Log this error
        throw new Error("Chat room not found");
    }

    const sender = await User.findById(senderId);

    const message = new Message({
        chatRoomId: chatRoom.id,
        senderId: sender.id,
        body: body,
        fileContent: fileContent, // Include file URL
    });

    try {
        await message.save();
        logger.info(`Message saved with id: ${message.id}`); // Log this info
    } catch (err) {
        logger.error(`Failed to save message: ${err}`); // Log this error
        throw new Error("Failed to save message"); // Propagate the error to the client
    }

    chatRoom.messageIds.push(message.id);
    await chatRoom.save();

    // This publishes the new message to the subscription
    pubSub.publish(`NEW_MESSAGE_${chatRoomId}`, { newMessage: message });

    return message;
};

module.exports = {sendMessage};
