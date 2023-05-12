const User = require("../models/User");
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");
const { getUserById } = require("./user-utils");

const sendMessage = async (_, {chatRoomId, senderId, text}) => {
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
        throw new Error('ChatRoomViewer not found');
    }

    const sender = await getUserById(senderId);

    const message = new Message({
        chatRoomId: chatRoom.id, senderId: sender.id, text: text,
    });

    await message.save();

    chatRoom.messagesIds.push(message.id);
    await chatRoom.save();

    return message;
};

module.exports = sendMessage;
