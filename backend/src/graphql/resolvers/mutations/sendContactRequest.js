const { getUserById } = require('../utils/user-utils');
const ContactRequest = require("../../../models/ContactRequest");

const sendContactRequest = async (parent, {senderId, recipientId}) => {
    const sender = await getUserById(senderId);
    const recipient = await getUserById(recipientId);

    try {
        const contactRequest = new ContactRequest({
            senderId: sender.id,
            recipientId: recipient.id,
            status: 'pending'
        });
        await contactRequest.save();

        return contactRequest;
    } catch (err) {
        console.error(err);
        throw new Error("Failed to send contact request");
    }
};

module.exports = sendContactRequest;
