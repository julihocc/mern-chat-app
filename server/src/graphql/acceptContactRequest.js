const { getUserById } = require('./user-utils');
const { getContactRequest } = require('./contact-request-utils');
const ContactRequest = require("../models/ContactRequest");
const ChatRoom = require("../models/ChatRoom");

const acceptContactRequest = async (parent, {senderId, recipientId}) => {
    const sender = await getUserById(senderId);
    const recipient = await getUserById(recipientId);

    const contactRequest = await getContactRequest(sender.id, recipient.id);

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
        console.error(err);
    }
};

module.exports = acceptContactRequest;
