// path: backend\src\graphql\resolvers\utils\contact-request-utils.js
const ContactRequest = require("../../../models/ContactRequest");
const logger = require('../../../logger');
async function getContactRequest(senderId, recipientId) {
    const contactRequest = await ContactRequest.findOne({senderId, recipientId});
    if (!contactRequest) {
        logger.error(`Contact request not found for senderId: ${senderId} and recipientId: ${recipientId}`); // Log this error
        throw new Error('Contact request not found');
    }
    return contactRequest;
}

module.exports = { getContactRequest };
