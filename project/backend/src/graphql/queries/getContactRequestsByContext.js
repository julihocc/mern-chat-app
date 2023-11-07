const logger = require("../../utils/logger");
const { AuthenticationError } = require("apollo-server-express");
const { getUserFromToken } = require("../../../../authService/src/authUtils");
const ContactRequest = require("../../models/ContactRequestModel");
const getContactRequestsByContext = async (parent, args, context) => {
  //logger.debug("Calling getContactRequests")
  const { token } = context;
  //logger.debug(token)

  if (!token) {
    throw new AuthenticationError("You must be logged in");
  }

  const recipient = await getUserFromToken(token);
  //logger.debug('user', !!recipient)

  // Check if the user is logged in
  if (!recipient) {
    throw new AuthenticationError("You must be logged in");
  }

  //logger.debug(recipient)
  //logger.debug(recipient.id)
  // Fetch all contact requests where the user is the recipient
  const contactRequest = ContactRequest.find({
    recipientId: recipient.id,
  }).populate("senderId");
  //logger.debug(!!contactRequest)
  if (!contactRequest) {
    throw new Error("Contact requests not found");
  }
  return contactRequest;
};
module.exports = { getContactRequestsByContext };
