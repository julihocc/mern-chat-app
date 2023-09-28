// path: backend\src\graphql\resolvers\mutations\sendContactRequest.js
const User = require("../../models/UserModel");
const ContactRequest = require("../../models/ContactRequestModel");
const logger = require('../../logger');
const {AuthenticationError} = require("apollo-server-express");
const {getUserFromToken} = require("../utils");

const sendContactRequest = async (parent, {senderId, recipientId}, context) => {

    const {token} = context

    const user = await getUserFromToken(token);

    if (!user) {
        logger.error('Attempt unautorized acess');
        throw new AuthenticationError("You are not logged in");
    }

    const sender = await User.findById(senderId);

    if (!sender) {
        throw new Error(`Sender not found: ${senderId}`);
    }

    if (sender.id.toString() !== user.id.toString()) {
        throw new Error(`You cannot send a contact request in the behalf of ${sender.id}`);
    }

    const recipient = await User.findById(recipientId);

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

        //logger.info(`Contact request sent from ${senderId} to ${recipientId}`); // log the info

        return contactRequest;
    } catch (err) {
        logger.error(); // log the error
        throw new Error(`Failed to send contact request from ${senderId} to ${recipientId}: ${err}`);
    }
};

module.exports = {sendContactRequest};
