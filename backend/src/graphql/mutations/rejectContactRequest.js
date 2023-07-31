// backend\src\graphql\resolvers\mutations\rejectContactRequest.js
const { getUserFromToken } = require('../utils/utils');
const ContactRequest = require("../../models/ContactRequestModel");
const { AuthenticationError } = require('apollo-server-express');
const logger = require('../../logger');

const rejectContactRequest = async (parent, { requestId }, context ) => {

    const { token, pubSub } = context; // Added pubSub here
    const user = await getUserFromToken(token);

    if (!user) {
        logger.error('Attempted unauthorized access.'); // log the error
        throw new AuthenticationError('You must be logged in');
    }

    const contactRequest = await ContactRequest.findById(requestId);

    if (!contactRequest) {
        logger.error(`Contact request not found: ${requestId}`); // log the error
        throw new Error('Contact request not found');
    }

    // Ensure that the authenticated user is involved in the contact request
    if (user.id !== contactRequest.recipientId.toString()) {
        logger.error(`Unauthorized access attempt by user: ${user.id}`); // log the error
        throw new AuthenticationError('You are not authorized to perform this action');
    }

    try {
        contactRequest.status = 'rejected';
        await contactRequest.save();
        logger.info(`Contact request rejected: ${requestId}`); // log the info

        // Added pubSub publish here for both sender and recipient
        pubSub.publish(`FRIEND_REQUEST_UPDATED_${contactRequest.senderId}`, { friendRequestUpdated: contactRequest });
        pubSub.publish(`FRIEND_REQUEST_UPDATED_${contactRequest.recipientId}`, { friendRequestUpdated: contactRequest });

        return contactRequest;
    } catch (err) {
        logger.error(err); // log the error
    }
};

module.exports = rejectContactRequest;
