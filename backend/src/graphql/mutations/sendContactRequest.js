// path: backend\src\graphql\resolvers\mutations\sendContactRequest.js
const User = require("../../models/UserModel");
const ContactRequest = require("../../models/ContactRequestModel");
const logger = require("../../logger");
const {AuthenticationError} = require("apollo-server-express");
const {getUserFromToken} = require("../utils");
const Joi = require("joi");

const sendContactRequest = async (_, {recipientId}, context) => {

    const schema = Joi.object({
        recipientId: Joi.string().required().message("RecipientId is required"),
    });

    const {error} = schema.validate({recipientId});

    if (error) {
        logger.error(`Validation error: ${error}`);
        throw new Error(`Validation error: ${error}`);
    }

    const {token} = context;

    const sender = await getUserFromToken(token);

    if (!sender) {
        logger.error("Attempt unautorized acess");
        throw new AuthenticationError("You are not logged in");
    }

    const recipient = await User.findById(recipientId);

    if (!recipient) {
        throw new Error(`Recipient not found: ${recipientId}`);
    }

    try {
        const contactRequest = new ContactRequest({
            senderId: sender.id,
            recipientId: recipient.id,
            status: "pending",
        });

        await contactRequest.save();

        return contactRequest;
    } catch (err) {
        logger.error(`Error whe saving contact request ${err}`);
        throw new Error(
            `Failed to send contact request from ${sender.id} to ${recipient.id}: ${err}`,
        );
    }
};

module.exports = {sendContactRequest};
