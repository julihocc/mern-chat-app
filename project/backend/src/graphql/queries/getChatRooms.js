const logger = require("../../logger");
const { AuthenticationError } = require("apollo-server-express");
const { getUserFromToken } = require("../utils");
const ChatRoom = require("../../models/ChatRoomModel");
const getChatRooms = async (parent, args, context) => {
  const { token } = context;
  if (!token) {
    throw new AuthenticationError("You must be logged in");
  }
  const user = await getUserFromToken(token);
  if (!user) {
    throw new AuthenticationError("You must be logged in");
  }

  // Fetch all chat rooms where the user is a participant
  return ChatRoom.find({ participantIds: user.id });
};

module.exports = { getChatRooms };
