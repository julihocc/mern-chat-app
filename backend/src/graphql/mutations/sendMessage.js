// Path: backend/src/graphql/mutations/sendMessage.js
const ChatRoom = require("../../models/ChatRoomModel");
const Message = require("../../models/MessageModel");
const logger = require('../../logger');
const User = require('../../models/UserModel');
const {uploadFileToS3} = require('../s3Handler');

const sendMessage = async (_, {senderId, chatRoomId, body, fileToUpload}, {pubSub}) => {

    logger.debug("backend/src/graphql/mutations/sendMessage.js")
    const now = new Date();
    logger.debug(`sendMessage : ${now.getTime()}`, senderId, chatRoomId, body, !!fileToUpload);

    let fileUrl = null;

    if (fileToUpload) {
        logger.debug("sendMessage file: ", fileToUpload);
        try {
            fileUrl = await uploadFileToS3(
                fileToUpload,
                "my-bucket",
                `uploads/${fileToUpload.name}`
                );
            logger.debug('fileUrl: ', fileUrl);
        } catch (err) {
            logger.error(`Failed to upload file: ${err}`); // Log this error
            throw new Error('Failed to upload file'); // Propagate the error to the client
        }
    }

    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (chatRoom) {
        logger.debug("sendMessage chatRoom: ", chatRoom.id);
    } else {
        logger.error(`Failed to get chat room: ${err}`); // Log this error
        throw Error('Failed to get chat room'); // Propagate the error to the client
    }

    const sender = await User.findById(senderId);
    if (sender) {
        logger.debug("sendMessage sender: ", sender);
    } else {
        logger.error(`Failed to get sender: ${err}`); // Log this error
        throw Error('Failed to get sender'); // Propagate the error to the client
    }

    const message = new Message({
        chatRoomId: chatRoom.id,
        senderId: sender.id,
        body,
        fileUrl,
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
    pubSub.publish(`NEW_MESSAGE_${chatRoomId}`, {newMessage: message});

    return message;
};

module.exports = {sendMessage};
