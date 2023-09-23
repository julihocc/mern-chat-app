// resolvers/chatRoomResolver.js

const ChatRoom = require("../../../mongodb/models/ChatRoomModel");

const getChatRoomById = async (parent, {chatRoomId}) => {

    let chatRoom = await ChatRoom.findById(chatRoomId).populate("participants").populate("messages")

    // Ensure the populated chat room exists
    if (!chatRoom) {
        throw new Error("Chat room not found after population");
    }

    return chatRoom;
}

module.exports = {
    getChatRoomById
};
