const ChatRoom = require("../../models/ChatRoomModel");
const { AuthenticationError } = require("apollo-server-express");
const { getUserFromToken } = require("../utils");
const logger = require("../../logger");

const getChatRoomById = async (parent, { chatRoomId }, context) => {
  const { token } = context;
  if (!token) {
    throw new AuthenticationError("You must be logged in");
  }
  const user = await getUserFromToken(token);
  if (!user) {
    throw new AuthenticationError("You must be logged in");
  }
  const chatRoom = await ChatRoom.findById(chatRoomId);

  if (!chatRoom) {
    throw new Error("Chat room not found by that id");
  }

  const foundChatRoom = await ChatRoom.findOne({
    participantIds: user.id,
    _id: chatRoom._id,
  }).populate("participantIds");

  if (!foundChatRoom) {
    throw new Error("You are not part of this chat room");
  }
  // const chatRoom = ChatRoom.findOne({participantIds: user.id, id: chatRoomId});

  return foundChatRoom;
};

module.exports = {
  getChatRoomById,
};
