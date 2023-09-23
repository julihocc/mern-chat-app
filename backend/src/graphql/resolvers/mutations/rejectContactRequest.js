// backend\src\graphql\resolvers\mutations\rejectContactRequest.js
const { getUserFromToken } = require('../../../utils/authUtils');
const ContactRequest = require("../../../mongodb/models/ContactRequestModel");
const { AuthenticationError } = require('apollo-server-express');
const logger = require('../../../utils/logger');

const rejectContactRequest = async (parent, { requestId }, context ) => {

    const { token, pubSub } = context; // Added pubSub here
    const actualRecipient = await getUserFromToken(token);

    if (!actualRecipient) {
        logger.error('Attempted unauthorized access.'); // log the error
        throw new AuthenticationError('You must be logged in');
    }

    const contactRequest = await ContactRequest.findById(requestId);

    if (!contactRequest) {
        logger.error(`Contact request not found: ${requestId}`); // log the error
        throw new Error('Contact request not found');
    }

    // Ensure that the authenticated user is involved in the contact request
    if (actualRecipient.id.toString() !== contactRequest.recipient.toString()) {
        logger.error(`Unauthorized access attempt by user: ${actualRecipient.id}`); // log the error
        throw new AuthenticationError('You are not authorized to perform this action');
    }

    try {
        logger.debug("Trying to reject request")
        contactRequest.status = 'rejected';
        await contactRequest.save();
        //logger.debug(`Contact request rejected: ${requestId}`); // log the info
        logger.info(`Contact request rejected: ${requestId}`); // log the info
        // Added pubSub publish here for both sender and actualRecipient
        pubSub.publish(`FRIEND_REQUEST_UPDATED_${contactRequest.sender}`, { friendRequestUpdated: contactRequest });
        pubSub.publish(`FRIEND_REQUEST_UPDATED_${contactRequest.recipient}`, { friendRequestUpdated: contactRequest });
        logger.debug("Friend request updated")
        return contactRequest;
    } catch (err) {
        logger.error(err); // log the error
    }
};

module.exports = {rejectContactRequest};
