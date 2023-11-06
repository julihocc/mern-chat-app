const User = require("../../authService/UserModel");
const ChatRoom = require("../../models/ChatRoomModel");
const { AuthenticationError } = require("apollo-server-express");
const { getUserFromToken } = require("../utils");
const logger = require("../../logger");

const getOneToOneChatRoom = async (_, { contactId }, { token }) => {
  if (!token) {
    throw new AuthenticationError("You must be logged in");
  }
  const currentUser = await getUserFromToken(token);
  if (!currentUser) {
    throw new AuthenticationError("Invalid token");
  } else {
    logger.debug(`Current user: ${currentUser.id}`);
  }

  logger.debug(`Contact id: ${contactId} ${typeof contactId}`);

  const otherUser = await User.findById(contactId);
  if (!otherUser) {
    logger.error(`Contact not found: ${contactId.email}`);
    throw new Error("Contact not found");
  } else {
    logger.debug(`Other user: ${otherUser}`);
  }

  const chatRoom = await ChatRoom.findOne({
    participantIds: {
      $all: [currentUser.id, contactId],
      $size: 2,
    },
  });

  if (!chatRoom) {
    throw new Error("Chat room not found");
  }
  return chatRoom;
};

module.exports = { getOneToOneChatRoom };
