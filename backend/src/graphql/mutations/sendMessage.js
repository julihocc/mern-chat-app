// Path: backend/src/graphql/mutations/sendMessage.js
const mongoose = require('mongoose'); // Import mongoose
const ChatRoom = require("../../models/ChatRoomModel");
const Message = require("../../models/MessageModel");
const logger = require('../../logger');
const User = require('../../models/UserModel');

const sendMessage = async (_, { senderId, chatRoomId, body, file }, { pubSub }) => {
    // Log the inputs without fileUrl, as it's not defined yet
    logger.info(`Received sendMessage request with senderId: ${senderId}, chatRoomId: ${chatRoomId}, body: ${body}`);

    // Handle file upload if provided
    let fileUrl = null;
    if (file) {
        const { createReadStream, filename } = await file;
        const stream = createReadStream();

        // Create GridFS bucket
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: "uploads",
        });

        // Create a write stream and save the file
        const uploadStream = bucket.openUploadStream(filename);
        stream.pipe(uploadStream);

        // Wait for the stream to finish to get the file URL
        await new Promise(resolve => uploadStream.once('finish', resolve));
        fileUrl = `/uploads/${uploadStream.id}`; // Generate the file URL
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
        fileUrl: fileUrl, // Include file URL
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
