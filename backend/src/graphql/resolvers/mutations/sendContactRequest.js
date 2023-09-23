// path: backend\src\graphql\resolvers\mutations\sendContactRequest.js
const User = require("../../../mongodb/models/UserModel");
const ContactRequest = require("../../../mongodb/models/ContactRequestModel");
const logger = require('../../../utils/logger');
const {AuthenticationError} = require("apollo-server-express");
const {getUserFromToken} = require("../../../utils/authUtils");

const sendContactRequest = async (parent, {recipientEmail}, context) => {

    const {token} = context;
    const sender = await getUserFromToken(token);


    if (!sender) {
        logger.error('Attempted unauthorized access.'); // log the error
        throw new AuthenticationError('You must be logged in');
    } else {
        logger.debug(`Sender: ${sender.email}`);
    }

    logger.debug(`Looking for ${recipientEmail}`)
    const recipient = await User.findOne({ email: recipientEmail});


    if (!recipient) {
        throw new Error(`Recipient not found: ${recipientEmail}`);
    } else {
        logger.debug(`Recipient ${recipient.email} found`);
    }

    try {
        const contactRequest = new ContactRequest({
            sender: sender._id,
            recipient: recipient._id,
            status: 'pending'
        });
        logger.debug(`Awating for save request`)
        await contactRequest.save();
        logger.debug(`Request saved`)
        return contactRequest;
    } catch (err) {
        throw new Error(`Failed to send contact request from ${sender._id} to ${recipient.id}: ${err}`);
    }
};

module.exports = {sendContactRequest};
