// contactService\src\graphql\resolvers\mutations\rejectContactRequest.js
const {getUserFromToken} = require("../../utils/authentication");
const ContactRequest = require("../../models/ContactRequestModel");
const {AuthenticationError} = require("apollo-server-express");
const logger = require("../../utils/logger");

const rejectContactRequest = async (parent, {requestId}, context) => {
	const {token, pubSub} = context; // Added pubSub here
	const user = await getUserFromToken(token);

	if (!user) {
		logger.error("Attempted unauthorized access.");
		throw new AuthenticationError("You must be logged in");
	}

	const contactRequest = await ContactRequest.findById(requestId);

	if (!contactRequest) {
		logger.error(`Contact request not found: ${requestId}`);
		throw new Error("Contact request not found");
	}

	if (user.id !== contactRequest.recipientId.toString()) {
		logger.error(`Unauthorized access attempt by user: ${user.id}`); // log the error
		throw new AuthenticationError("You are not authorized to perform this action",);
	}

	try {
		contactRequest.status = "rejected";
		await contactRequest.save();

		pubSub.publish(`FRIEND_REQUEST_UPDATED_${contactRequest.senderId}`, {
			friendRequestUpdated: contactRequest,
		});
		pubSub.publish(`FRIEND_REQUEST_UPDATED_${contactRequest.recipientId}`, {
			friendRequestUpdated: contactRequest,
		});

		return contactRequest;
	} catch (err) {
		logger.error(err); // log the error
	}
};

module.exports = {rejectContactRequest};
