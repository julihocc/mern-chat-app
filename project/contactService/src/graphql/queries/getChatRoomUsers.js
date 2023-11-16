const ChatRoom = require("../../models/ChatRoomModel");
const User = require("../../models/UserModel");

const getChatRoomUsers = async (_, { chatRoomId }, __) => {
  const chatRoom = await ChatRoom.findById(chatRoomId);
  if (!chatRoom) throw new Error("Chat room not found");
  const participants = chatRoom.participantIds;
  return User.find({ _id: { $in: participants } });
};

module.exports = { getChatRoomUsers };
