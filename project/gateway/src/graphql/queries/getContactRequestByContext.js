const {AuthenticationError} = require("apollo-server-express");
// const {getUserFromToken} = require("../../utils/authentication");
// const ContactRequest = require("../../models/ContactRequestModel");
const getContactRequestsByContext = async (parent, args, context) => {
	const {token} = context;

	if (!token) {
		throw new AuthenticationError("You must be logged in");
	}

	// const recipient = await getUserFromToken(token);
	const recipient = await context.dataSources.authAPI.getUserById(token)

	if (!recipient) {
		throw new AuthenticationError("You must be logged in");
	}

	// const contactRequest = ContactRequest.find({
	// 	recipientId: recipient.id,
	// }).populate("senderId");

	const contactRequest = await context.dataSources.contactAPI.getContactRequestsByRecipientId(recipient._id);

	if (!contactRequest) {
		throw new Error("Contact requests not found");
	}
	return contactRequest;
};
module.exports = {getContactRequestsByContext};
