const User = require('../models/UserModel');
const ContactRequest = require('../models/ContactRequestModel');
const {debug} = require("../utils/logger");
const sendContactRequest = async (req, res) => {
	debug("sendContactRequest")
	try {
		const {senderId, recipientId, status} = req.body;
		const contactRequest = new ContactRequest({senderId, recipientId, status});
		await contactRequest.save();
		res.json(contactRequest);
		res.status(200);
		return contactRequest;
	} catch (error) {
		res.status(500).json({message: `sendContactRequest error: ${error}`});
	}
}

module.exports = {sendContactRequest};