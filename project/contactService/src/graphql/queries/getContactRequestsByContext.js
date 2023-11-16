const {AuthenticationError} = require("apollo-server-express");
const {getUserFromToken} = require("../../utils/authentication");
const ContactRequest = require("../../models/ContactRequestModel");
const getContactRequestsByContext = async (parent, args, context) => {
	const {token} = context;

	if (!token) {
		throw new AuthenticationError("You must be logged in");
	}

	const recipient = await getUserFromToken(token);

	if (!recipient) {
		throw new AuthenticationError("You must be logged in");
	}

	const contactRequest = ContactRequest.find({
		recipientId: recipient.id,
	}).populate("senderId");
	if (!contactRequest) {
		throw new Error("Contact requests not found");
	}
	return contactRequest;
};
module.exports = {getContactRequestsByContext};
