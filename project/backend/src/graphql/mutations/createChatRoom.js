// backend\src\graphql\resolvers\mutations\createChatRoom.js
const User = require("../../authService/UserModel");
const ChatRoom = require("../../models/ChatRoomModel");
const { AuthenticationError } = require("apollo-server-express");
const { getUserFromToken } = require("../utils");
const logger = require("../../logger");
const createChatRoom = async (_, { participantIds }, context) => {
  const { token } = context;
  const user = await getUserFromToken(token);
  if (!user) {
    throw new AuthenticationError("You are not logged in");
  }

  const participants = await User.find({ _id: { $in: participantIds } });

  if (participants.length !== participantIds.length) {
    throw new Error("Some participantIds not found");
  }

  const existingChatRoom = await ChatRoom.findOne({
    participantIds: { $all: participantIds },
  });
  if (existingChatRoom) {
    throw new Error("ChatRoom with these participants already exists");
  }

  const chatRoom = new ChatRoom({ participantIds });
  await chatRoom.save();
  return chatRoom;
};

module.exports = { createChatRoom };
