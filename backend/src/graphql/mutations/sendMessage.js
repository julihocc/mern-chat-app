// Path: backend\src\graphql\resolvers\mutations\sendMessage.js
// require("../../models/UserModel");
const ChatRoom = require("../../models/ChatRoomModel");
const Message = require("../../models/MessageModel");
const logger = require('../../logger');
const User = require('../../models/UserModel');

const s3 = require('./s3'); // Adjust the path according to your file structure

async function uploadFile(file) {
    const { createReadStream, filename } = await file;
    const fileStream = createReadStream();

    return new Promise((resolve, reject) => {
        const params = {
            Bucket: 'chat-app', // Replace with your bucket name
            Key: filename,
            Body: fileStream
        };

        s3.upload(params, (err, data) => {
            if (err) {
                reject(err);
            }

            resolve(data);
        });
    });
}

const sendMessage = async (_, { senderId, chatRoomId, body, file }, { pubSub }) => {
    const chatRoom = await ChatRoom.findById(chatRoomId);

    if (!chatRoom) {
        logger.error('hooks not found'); // Log this error
        throw new Error('hooks not found');
    }

    const sender = await User.findById(senderId);

    let imageUrl;

    // Check if image was sent
    if (file) {
        try {
            const uploadedImage = await uploadFile(file);
            imageUrl = uploadedImage.Location; // This is the URL of the uploaded image
        } catch (err) {
            logger.error(`Failed to upload image: ${err}`); // Log this error
        }
    }

    const message = new Message({
        chatRoomId: chatRoom.id,
        senderId: sender.id,
        body: imageUrl ? '' : body, // If an image was uploaded, we set the body to an empty string
        imageUrl: imageUrl, // The imageUrl field will be undefined if no image was uploaded
    });

    try {
        await message.save();
        //logger.info(`Message saved with id: ${message.id}`); // Log this info
    } catch (err) {
        logger.error(`Failed to save message: ${err}`); // Log this error
    }

    chatRoom.messageIds.push(message.id);
    await chatRoom.save();

    // this publishes the new message to the subscription
    pubSub.publish(`NEW_MESSAGE_${chatRoomId}`, { newMessage: message });

    return message;
};

module.exports = {sendMessage};
