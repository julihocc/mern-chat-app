// path: backend\src\graphql\resolvers\mutations\sendContactRequest.js
const User = require("../../models/UserModel");
const ContactRequest = require("../../models/ContactRequestModel");
const logger = require('../../logger');
const {AuthenticationError} = require("apollo-server-express");
const {getUserFromToken} = require("../utils");

const sendContactRequest = async (parent, {senderId, recipientId}, context) => {

    const {token} = context;
    const user = await getUserFromToken(token);

    if (!user) {
        logger.error('Attempted unauthorized access.'); // log the error
        throw new AuthenticationError('You must be logged in');
    }

    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!sender) {
        throw new Error(`Sender not found: ${senderId}`);
    }

    if (!recipient) {
        throw new Error(`Recipient not found: ${recipientId}`);
    }

    try {
        const contactRequest = new ContactRequest({
            senderId: sender.id,
            recipientId: recipient.id,
            status: 'pending'
        });

        await contactRequest.save();

        return contactRequest;
    } catch (err) {
        throw new Error(`Failed to send contact request from ${senderId} to ${recipientId}: ${err}`);
    }
};

module.exports = {sendContactRequest};
