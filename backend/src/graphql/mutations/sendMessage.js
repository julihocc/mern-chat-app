// Path: backend/src/graphql/mutations/sendMessage.js
const ChatRoom = require("../../models/ChatRoomModel");
const Message = require("../../models/MessageModel");
const logger = require('../../logger');
const User = require('../../models/UserModel');

const sendMessage = async (_, { senderId, chatRoomId, body, fileUrl }, { pubSub }) => {
    logger.info(`Received sendMessage request with senderId: ${senderId}, chatRoomId: ${chatRoomId}, body: ${body}, fileUrl: ${fileUrl}`); // Log the inputs

    const chatRoom = await ChatRoom.findById(chatRoomId);

    if (!chatRoom) {
        logger.error('Chat room not found'); // Log this error
        throw new Error('Chat room not found');
    }

    const sender = await User.findById(senderId);

    const message = new Message({
        chatRoomId: chatRoom.id,
        senderId: sender.id,
        body: body,
        fileUrl: fileUrl,
    });

    try {
        await message.save();
        logger.info(`Message saved with id: ${message.id}`); // Log this info
    } catch (err) {
        logger.error(`Failed to save message: ${err}`); // Log this error
        throw new Error('Failed to save message'); // Propagate the error to the client
    }

    chatRoom.messageIds.push(message.id);
    await chatRoom.save();

    // this publishes the new message to the subscription
    pubSub.publish(`NEW_MESSAGE_${chatRoomId}`, { newMessage: message });

    return message;
};

module.exports = {sendMessage};
