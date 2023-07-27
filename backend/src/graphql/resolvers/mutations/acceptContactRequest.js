// Path: backend\src\graphql\resolvers\mutations\acceptContactRequest.js
const { getUserFromToken } = require('../utils/utils');
const ContactRequest = require("../../../models/ContactRequest");
const ChatRoom = require("../../../models/ChatRoom");
const { AuthenticationError } = require('apollo-server-express');
const logger = require("../../../logger"); // Import the logger

const acceptContactRequest = async (parent, { requestId }, context ) => {

    const { token, pubSub } = context; // Added pubSub here

    if (!token) {
        throw new AuthenticationError('You must be logged in');
    }

    if (!requestId) {
        throw new Error('Request ID is required');
    }

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

        // Furthermore, pubSub publish here for both sender and recipient
        pubSub.publish(`FRIEND_REQUEST_UPDATED_${contactRequest.senderId}`, { friendRequestUpdated: contactRequest });
        pubSub.publish(`FRIEND_REQUEST_UPDATED_${contactRequest.recipientId}`, { friendRequestUpdated: contactRequest });

        return contactRequest;
    } catch (err) {
        logger.error(err); // Use the logger here
    }
};

module.exports = acceptContactRequest;
