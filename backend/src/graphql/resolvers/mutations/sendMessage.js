// Path: backend/src/graphql/mutations/sendMessage.js
const ChatRoom = require("../../../mongodb/models/ChatRoomModel");
const Message = require("../../../mongodb/models/MessageModel");
const logger = require('../../../utils/logger');
const User = require('../../../mongodb/models/UserModel');
const {AuthenticationError} = require("apollo-server-express");

const sendMessage = async (_, {senderId, chatRoomId, body, fileContent}, context) => {

    const {token, pubSub} = context
    if (!token) {
        throw new AuthenticationError("You must be logged in!")
    }

    logger.debug(`Received sendMessage request with senderId: ${senderId}, chatRoomId: ${chatRoomId}, body: ${!!body}, fileContent: ${!!fileContent}`);

    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
        logger.error("Chat room not found");
        throw Error("Chat room not found");
    }

    const sender = await User.findById(senderId);
    if (!sender) {
        logger.error("Sender not found");
        throw Error("Sender not found");
    }

    const message = new Message({
        chatRoomId: chatRoom.id, senderId: sender.id, body: body || null, fileContent: fileContent || null,
    });

    try {
        await message.save();
        logger.debug(`Message saved with id: ${message.id}`);
    } catch (err) {
        logger.error(`Failed to save message: ${err}`);
        throw new Error("Failed to save messages");
    }

    try {
        chatRoom.messageIds.push(message.id);
        await chatRoom.save();
        logger.debug(`Chat room updated with message id: ${message.id}`);
        pubSub.publish(`NEW_MESSAGE_${chatRoomId}`, {newMessage: message});

        return message;
    } catch (err) {
        logger.error(`Failed to update chat room: ${err}`);
        throw new Error("Failed to update chat room");
    }
};

module.exports = {sendMessage};
