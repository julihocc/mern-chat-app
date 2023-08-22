// Path: backend/src/graphql/mutations/sendMessage.js

const ChatRoom = require("../../models/ChatRoomModel");
const Message = require("../../models/MessageModel");
const logger = require('../../logger');
const User = require('../../models/UserModel');

const sendMessage = async (_, {senderId, chatRoomId, body, fileContent}, {pubSub}) => {
    // Log the inputs without fileUrl, as it's not defined yet
    logger.debug(`Received sendMessage request with senderId: ${senderId}, chatRoomId: ${chatRoomId}, body: ${!!body}, fileContent: ${!!fileContent}`);


    // Existing logic for sending a message
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
        logger.error("Chat room not found"); // Log this error
        throw Error("Chat room not found");
    }

    const sender = await User.findById(senderId);
    if (!sender) {
        logger.error("Sender not found"); // Log this error
        throw Error("Sender not found");
    }

    const message = new Message({
        chatRoomId: chatRoom.id, senderId: sender.id, body: body || null, fileContent: fileContent || null, // Include file URL
    });

    try {
        await message.save();
        logger.debug(`Message saved with id: ${message.id}`); // Log this info
    } catch (err) {
        logger.error(`Failed to save message: ${err}`); // Log this error
        throw new Error("Failed to save message"); // Propagate the error to the client
    }

    try {
        chatRoom.messageIds.push(message.id);
        await chatRoom.save();
        logger.debug(`Chat room updated with message id: ${message.id}`); // Log this info
        // This publishes the new message to the subscription
        pubSub.publish(`NEW_MESSAGE_${chatRoomId}`, {newMessage: message});

        return message;
    } catch (err) {
        logger.error(`Failed to update chat room: ${err}`); // Log this error
        throw new Error("Failed to update chat room"); // Propagate the error to the client
    }
};

module.exports = {sendMessage};
