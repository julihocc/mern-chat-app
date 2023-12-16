const {AuthenticationError} = require("apollo-server-express");
const {debug} = require("winston");
const getContactRequestsByContext = async (parent, args, context) => {
	debug("ContactController | getContactRequestsByContext")
	const {token} = context;

	if (!token) {
		throw new AuthenticationError("You must be logged in");
	}
	debug(`ContactController | getContactRequestsByContext | token: ${token}`)

	const recipient = await context.dataSources.authAPI.getUserByToken(token)
	debug(`ContactController | getContactRequestsByContext | recipient: ${JSON.stringify(recipient)}`)

	if (!recipient) {
		throw new AuthenticationError("You must be logged in");
	}


	const contactRequest = await context.dataSources.contactAPI.getContactRequestsByRecipientId(recipient._id);
	debug(`ContactController | getContactRequestsByContext | contactRequest: ${JSON.stringify(contactRequest)}`)

	if (!contactRequest) {
		throw new Error("Contact requests not found");
	}
	return contactRequest;
};
module.exports = {getContactRequestsByContext};
