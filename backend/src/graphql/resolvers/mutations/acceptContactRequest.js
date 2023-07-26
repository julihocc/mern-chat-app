const { getUserFromToken } = require('../utils/utils');
const ContactRequest = require("../../../models/ContactRequest");
const ChatRoom = require("../../../models/ChatRoom");
const { AuthenticationError } = require('apollo-server-express');
const logger = require("../../../config/logger"); // Import the logger

const acceptContactRequest = async (parent, { requestId }, context ) => {
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
        contactRequest.status = 'accepted';
        await contactRequest.save();

        const chatRoom = new ChatRoom({
            participantIds: [contactRequest.senderId, contactRequest.recipientId],
            messagesIds: []
        });

        await chatRoom.save();

        contactRequest.chatRoomId = chatRoom.id;
        await contactRequest.save();

        return contactRequest;
    } catch (err) {
        logger.error(err); // Use the logger here
    }
};

module.exports = acceptContactRequest;
