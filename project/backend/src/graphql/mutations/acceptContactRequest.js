// Path: backend\src\graphql\resolvers\mutations\acceptContactRequest.js
const { getUserFromToken } = require("../utils");
const User = require("../../authService/UserModel");
const ContactRequest = require("../../models/ContactRequestModel");
const ChatRoom = require("../../models/ChatRoomModel");
const { AuthenticationError } = require("apollo-server-express");
const logger = require("../../logger");

const acceptContactRequest = async (parent, { requestId }, context) => {
  const { token, pubSub } = context;

  if (!token) {
    throw new AuthenticationError("You must be logged in");
  }

  if (!requestId) {
    throw new Error("Request ID is required");
  }

  const user = await getUserFromToken(token);

  if (!user) {
    throw new AuthenticationError("You must be logged in");
  }

  const contactRequest = await ContactRequest.findById(requestId);

  if (!contactRequest) {
    throw new Error("Contact request not found");
  }

  if (user.id !== contactRequest.recipientId.toString()) {
    throw new AuthenticationError(
      "You are not authorized to perform this action",
    );
  }

  try {
    contactRequest.status = "accepted";
    await contactRequest.save();

    const chatRoom = new ChatRoom({
      participantIds: [contactRequest.senderId, contactRequest.recipientId],
      messagesIds: [],
    });

    await chatRoom.save();

    contactRequest.chatRoomId = chatRoom.id;
    await contactRequest.save();

    const recipient = await User.findById(contactRequest.recipientId);
    const sender = await User.findById(contactRequest.senderId);

    recipient.contacts.push(contactRequest.senderId);
    await recipient.save();

    sender.contacts.push(contactRequest.recipientId);
    await sender.save();

    pubSub.publish(`FRIEND_REQUEST_UPDATED_${contactRequest.senderId}`, {
      friendRequestUpdated: contactRequest,
    });
    pubSub.publish(`FRIEND_REQUEST_UPDATED_${contactRequest.recipientId}`, {
      friendRequestUpdated: contactRequest,
    });

    return contactRequest;
  } catch (err) {
    logger.error(err);
  }
};

module.exports = { acceptContactRequest };
