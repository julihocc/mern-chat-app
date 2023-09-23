// resolvers/chatRoomResolver.js

const ChatRoom = require("../../models/ChatRoomModel");

const getChatRoomById = async (parent, {chatRoomId}) => {

    let chatRoom = await ChatRoom.findById(chatRoomId).populate("participantIds")

    // Ensure the populated chat room exists
    if (!chatRoom) {
        throw new Error("Chat room not found after population");
    }

    return chatRoom;
}

module.exports = {
    getChatRoomById
};
