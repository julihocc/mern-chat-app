// backend\src\graphql\resolvers\mutations\rejectContactRequest.js

const { getUserFromToken } = require('../utils/utils');
const ContactRequest = require("../../../models/ContactRequest");
const { AuthenticationError } = require('apollo-server-express');

const rejectContactRequest = async (parent, { requestId }, context ) => {

    const { token } = context;
    const user = await getUserFromToken(token);

    if (!user) {
        throw new AuthenticationError('You must be logged in');
    }

    const contactRequest = await ContactRequest.findById(requestId);

    if (!contactRequest) {
        throw new Error('Contact request not found');
    }

    // Ensure that the authenticated user is involved in the contact request
    if (user.id !== contactRequest.senderId.toString() && user.id !== contactRequest.recipientId.toString()) {
        throw new AuthenticationError('You are not authorized to perform this action');
    }

    try {
        contactRequest.status = 'rejected';
        await contactRequest.save();

        return contactRequest;
    } catch (err) {
        console.error(err);
    }
};

module.exports = rejectContactRequest;
