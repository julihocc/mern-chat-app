const ChatRoom = require("../../models/ChatRoomModel");

const getChatRoomById= async (parent, {chatRoomId}) => {
    const chatRoom = ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
        throw new Error("Chat room not found");
    }
    return chatRoom;
}

module.exports = {
    getChatRoomById
}
