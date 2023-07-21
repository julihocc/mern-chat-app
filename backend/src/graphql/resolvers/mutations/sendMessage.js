require("../../../models/User");
const ChatRoom = require("../../../models/ChatRoom");
const Message = require("../../../models/Message");
const { getUserById } = require("../utils/user-utils");

const sendMessage = async (_, { senderId, chatRoomId, body: body}, { pubSub }) => {
    console.log('loading sendMessage')
    console.log('sendMessage: ', senderId)
    console.log('sendMessage: ', chatRoomId)
    console.log('sendMessage: ', body)
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
        throw new Error('ChatRoomViewer not found');
    }

    const sender = await getUserById(senderId);

    const message = new Message({
        chatRoomId: chatRoom.id, senderId: sender.id, body: body,
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
