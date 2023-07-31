const ChatRoom = require("../../models/ChatRoomModel");
const getChatRoom= async (parent, {chatRoomId}) => {
    return ChatRoom.findById(chatRoomId);
}
module.exports = {
    getChatRoom
}
