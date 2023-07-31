const logger = require("../../logger");
const {AuthenticationError} = require("apollo-server-express");
const {getUserFromToken} = require("../utils/utils");
const ContactRequest = require("../../models/ContactRequestModel");
const getContactRequestsByContext= async (parent, args, context) => {
    logger.info("Calling getContactRequests")
    const {token} = context;
    logger.info(token)

    if (!token) {
        throw new AuthenticationError('You must be logged in');
    }

    const recipient = await getUserFromToken(token);
    logger.info('user', !!recipient)

    // Check if the user is logged in
    if (!recipient) {
        throw new AuthenticationError('You must be logged in');
    }

    logger.info(recipient)
    logger.info(recipient.id)
    // Fetch all contact requests where the user is the recipient
    const contactRequest = ContactRequest.find({recipientId: recipient.id});
    logger.info(!!contactRequest)
    if (!contactRequest) {
        throw new Error('Contact requests not found');
    }
    return contactRequest;

}
module.exports = {getContactRequestsByContext};
