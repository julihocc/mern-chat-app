const ContactRequest = require("../../../models/ContactRequest");

async function getContactRequest(senderId, recipientId) {
    const contactRequest = await ContactRequest.findOne({senderId, recipientId});
    if (!contactRequest) throw new Error('Contact request not found');
    return contactRequest;
}

module.exports = { getContactRequest };
