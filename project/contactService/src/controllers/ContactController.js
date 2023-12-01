const ContactRequest = require('../models/ContactRequestModel');
const {debug} = require("../utils/logger");
const sendContactRequest = async (req, res) => {
	debug("ContactController | sendContactRequest")
	const {senderId, recipientId} = req.body;
	debug(senderId, recipientId)
	try {
		const contactRequest = new ContactRequest({senderId, recipientId, status: "pending"});
		await contactRequest.save();
		res.json(contactRequest);
		res.status(200);
		return contactRequest;
	} catch (error) {
		res.status(500).json({message: `sendContactRequest error: ${error}`});
	}
}

const getContactRequest = async (req, res) => {
	debug("ContactController | getContactRequests")
	const {requestId} = req.query;
	debug(`debug: ${requestId}`)
	if(requestId) {
		try {
			const contactRequest = await ContactRequest.findById(requestId);
			debug(`ContactController | getContactRequests | contactRequest: ${JSON.stringify(contactRequest)}`)
			res.json(contactRequest);
			res.status(200);
			return contactRequest;
		} catch (error) {
			res.status(500).json({message: `ContactController | getContactRequests error: ${error}`});
		}
	}
}

module.exports = {sendContactRequest, getContactRequest };