const User = require("../../models/UserModel");
const ContactRequest = require("../../models/ContactRequestModel");
const logger = require("../../utils/logger");
const getContactRequests = async (_, {userId}, __) => {
	const user = await User.findById(userId);

	if (!user) {
		throw new Error("User not found");
	}

	try {
		return await ContactRequest.find({recipientId: userId});
	} catch (err) {
		logger.error("Error loading contact requests: ", err); // Log the error
		throw new Error("Error fetching contact requests");
	}
};
module.exports = {getContactRequests};
