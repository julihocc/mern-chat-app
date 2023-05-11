const { getUserById } = require('./user-utils');
const { getContactRequest } = require('./contact-request-utils');
const ContactRequest = require("../models/ContactRequest");

const rejectContactRequest = async (parent, {senderId, recipientId}) => {
    const sender = await getUserById(senderId);
    const recipient = await getUserById(recipientId);

    const contactRequest = await getContactRequest(sender.id, recipient.id);

    contactRequest.status = 'rejected';
    await contactRequest.save();

    return contactRequest;
};

module.exports = rejectContactRequest;
