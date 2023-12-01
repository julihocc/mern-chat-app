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

module.exports = {sendContactRequest};