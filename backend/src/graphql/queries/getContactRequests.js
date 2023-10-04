const User = require("../../models/UserModel");
const ContactRequest = require("../../models/ContactRequestModel");
const logger = require("../../logger");
 const getContactRequests= async (_, {userId}, __) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new Error('User not found')
    }

    try {
        const contactRequests = await ContactRequest.find({recipientId: userId})
        //logger.debug(`Contact requests fetched for user with id: ${userId}`); // Log this info
        return contactRequests;
    } catch (err) {
        logger.error("Error loading contact requests: ", err); // Log the error
        throw new Error('Error fetching contact requests');
    }
}
module.exports = {getContactRequests};
