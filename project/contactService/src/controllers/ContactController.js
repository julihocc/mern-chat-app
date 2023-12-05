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
	const {requestId, recipientId} = req.query;
	debug(`debug: ${requestId}`)
	debug(`debug: ${recipientId}`)
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
	if(recipientId) {
		try {
			const contactRequest = await ContactRequest.find({recipientId}).populate("senderId");
            debug(`ContactController | getContactRequests | contactRequest: ${JSON.stringify(contactRequest)}`)
            res.json(contactRequest);
            res.status(200);
            return contactRequest;
		} catch (error) {
			res.status(500).json({message: `ContactController | getContactRequests error: ${error}`});
		}
	}
}

const changeContactRequest = async (req, res) => {
	debug("ContactController | changeContactRequestStatus")
    const {requestId, status, chatRoomId} = req.body;
	debug(`requestId: ${requestId}`)
	debug(`status: ${status}`)
	debug(`chatRoomId: ${chatRoomId}`)
    if(requestId && status) {
        try {
            const contactRequest = await ContactRequest.findByIdAndUpdate(requestId, {status}, {new: true});
            debug(`ContactController | changeContactRequestStatus | contactRequest: ${JSON.stringify(contactRequest)}`)
            res.json(contactRequest);
            res.status(200);
            return contactRequest;
        } catch (error) {
            res.status(500).json({message: `ContactController | changeContactRequestStatus error: ${error}`});
        }
    }
	if (requestId&&chatRoomId) {
		try {
			const contactRequest = await ContactRequest.findByIdAndUpdate(requestId, {chatRoomId}, {new: true});
			debug(`ContactController | changeContactRequestStatus | contactRequest: ${JSON.stringify(contactRequest)}`)
			res.json(contactRequest);
			res.status(200);
			return contactRequest;
		} catch (error) {
			res.status(500).json({message: `ContactController | changeContactRequestStatus error: ${error}`});
		}
	}
}

module.exports = {sendContactRequest, getContactRequest, changeContactRequest};