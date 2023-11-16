// path: contactService/src/graphql/queries/getChatRoomsForCurrentUser.js
const ChatRoom = require("../../models/ChatRoomModel");
const logger = require("../../utils/logger");
const { getUserFromToken } = require("../../utils/authentication");

const getChatRoomsForCurrentUser = async (parent, args, context) => {
  const { token } = context;
  if (!token) {
    throw new Error("Not authenticated");
  }
  const user = await getUserFromToken(token);
  if (!user) {
    logger.error("User not found");
  }
  const chatRooms = await ChatRoom.find({ participantIds: user._id });
  if (!chatRooms) {
    logger.error("Chat rooms not found");
  }
  return chatRooms;
};

module.exports = { getChatRoomsForCurrentUser };
