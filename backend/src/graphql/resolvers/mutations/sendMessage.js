// Path: backend\src\graphql\resolvers\mutations\sendMessage.js
require("../../../models/User");
const ChatRoom = require("../../../models/ChatRoom");
const Message = require("../../../models/Message");
const { getUserById } = require("../utils/user-utils");

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


// Add 'imageUrl' to the destructuring assignment
const sendMessage = async (_, { senderId, chatRoomId, body, file }, { pubSub }) => {
    console.log('loading sendMessage')
    console.log('sendMessage: ', senderId)
    console.log('sendMessage: ', chatRoomId)
    console.log('sendMessage: ', body)

    const chatRoom = await ChatRoom.findById(chatRoomId);

    if (!chatRoom) {
        throw new Error('ChatRoomViewer not found');
    }

    const sender = await getUserById(senderId);

    let imageUrl;

    // Check if image was sent
    if (file) {
        const uploadedImage = await uploadFile(file);
        imageUrl = uploadedImage.Location; // This is the URL of the uploaded image
    }

    const message = new Message({
        chatRoomId: chatRoom.id,
        senderId: sender.id,
        body: imageUrl ? '' : body, // If an image was uploaded, we set the body to an empty string
        imageUrl: imageUrl, // The imageUrl field will be undefined if no image was uploaded
    });

    await message.save();

    console.log('message.id: ', message.id)
    console.log('chatRoom.messageIds: ', chatRoom.messageIds)

    chatRoom.messageIds.push(message.id);
    await chatRoom.save();

    // this publishes the new message to the subscription
    pubSub.publish(`NEW_MESSAGE_${chatRoomId}`, { newMessage: message });

    return message;
};

module.exports = sendMessage;
