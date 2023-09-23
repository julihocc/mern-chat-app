// Path: backend\src\graphql\resolvers\mutations\acceptContactRequest.js
const { getUserFromToken } = require('../../../utils/authUtils');
const User = require("../../../mongodb/models/UserModel");
const ContactRequest = require("../../../mongodb/models/ContactRequestModel");
const ChatRoom = require("../../../mongodb/models/ChatRoomModel");
const { AuthenticationError } = require('apollo-server-express');
const logger = require("../../../utils/logger"); // Import the logger
const display = require("../../../utils/display")

const acceptContactRequest = async (parent, { requestId }, context ) => {

    const { token, pubSub } = context; // Added pubSub here

    if (!requestId) {
        throw new Error('Request ID is required');
    }

    const recipient = await getUserFromToken(token);
    logger.debug(display("recipient", recipient))

    if (!recipient) {
        throw new AuthenticationError('You must be logged in');
    } else {
        logger.debug(`Recipient ${recipient}`)
        logger.debug(`Recipient ID: ${recipient._id}(${typeof recipient._id})`)
    }

    const contactRequest = await ContactRequest.findById(requestId);

    if (!contactRequest) {
        throw new Error('Contact request not found');
    } else {
        logger.debug(`Contact request ${contactRequest}`)
    }

    // if (contactRequest.status!== 'pending') {
    //     throw new Error('Contact request already accepted');
    // }

    if (contactRequest.recipient.toString()!==recipient._id.toString()){
        logger.debug(display("Contact request recipient", contactRequest.recipient))
        logger.debug(display("Recipient ID", recipient._id))
        throw new Error('You cannot accept this contact request');
    }

    try {
        contactRequest.status = 'accepted';
        await contactRequest.save();
    } catch (err) {
        logger.error(`Not able to accept request`);
    }
    try {
        const participants = [contactRequest.sender, contactRequest.recipient]
        logger.debug(display("Participant IDs", participants))
        const chatRoom = new ChatRoom({
            participants: participants,
            messages: []
        });
        logger.debug(display("Chatroom for saving", chatRoom))
        await chatRoom.save();
    } catch (err) {
        logger.error(`Not able to create chatroom ${err}`);
        throw Error(err)// Use the logger here
    }

    try{
        logger.debug(display("New contact (sender) ", contactRequest.recipient))
        logger.debug(display("New contact (recipient) ", contactRequest.sender))
        const recipient = await User.findById(contactRequest.recipient);
        const sender = await User.findById(contactRequest.sender);

        recipient.contacts.push(contactRequest.sender);
        await recipient.save();

        sender.contacts.push(contactRequest.recipient);
        await sender.save();



        // Furthermore, pubSub publish here for both sender and recipient
        pubSub.publish(`FRIEND_REQUEST_UPDATED_${contactRequest.sender}`, { friendRequestUpdated: contactRequest });
        pubSub.publish(`FRIEND_REQUEST_UPDATED_${contactRequest.recipient}`, { friendRequestUpdated: contactRequest });

        return contactRequest;
    } catch (err) {
        logger.error(`Not able to save new contacts `); // Use the logger here
    }
};

module.exports = {acceptContactRequest};
