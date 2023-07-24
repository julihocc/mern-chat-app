// Path: backend\src\graphql\resolvers\mutations\sendMessage.js
require("../../../models/User");
const ChatRoom = require("../../../models/ChatRoom");
const Message = require("../../../models/Message");
const { getUserById } = require("../utils/user-utils");

// Add 'imageUrl' to the destructuring assignment
const sendMessage = async (_, { senderId, chatRoomId, body, imageUrl}, { pubSub }) => {
    console.log('loading sendMessage')
    console.log('sendMessage: ', senderId)
    console.log('sendMessage: ', chatRoomId)
    console.log('sendMessage: ', body)
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
        throw new Error('ChatRoomViewer not found');
    }

    const sender = await getUserById(senderId);

    // Modify the creation of the new Message to include imageUrl
    const message = new Message({
        chatRoomId: chatRoom.id,
        senderId: sender.id,
        // If imageUrl is provided, body will be an empty string
        body: imageUrl ? '' : body,
        // imageUrl will be undefined if not provided
        imageUrl: imageUrl,
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
