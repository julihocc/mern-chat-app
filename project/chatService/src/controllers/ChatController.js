const ChatRoom = require('../models/ChatRoomModel');
const User = require('../models/UserModel');
const Message = require('../models/MessageModel');
const {debug} = require("../utils/logger");

const getChatRoomById = async (req, res) => {
	debug("getChatRoomById");
	try {
		const chatRoomId = req.body.chatRoomId;
		debug(`chatRoomId: ${chatRoomId}`);
		const chatRoom = await ChatRoom.findById(chatRoomId);
		debug(`chatRoom: ${chatRoom}`);
		res.json(chatRoom);
		res.status(200);
		return chatRoom;
	} catch (err) {
		res.status(500).json(
			{
                message: `Error getting chat room by id: ${err}`
            }
		)
	}
}

const getChatRoomByIdPopulatedWithUsers = async (req, res) => {
	debug("getChatRoomById");
	try {
		const chatRoomId = req.body.chatRoomId;
		debug(`chatRoomId: ${chatRoomId}`);
		const chatRoom = await ChatRoom.findById(chatRoomId).populate("participantIds");
		debug(`chatRoom: ${chatRoom}`);
		res.json(chatRoom);
		res.status(200);
		return chatRoom;
	} catch (err) {
		res.status(500).json(
			{
				message: `Error getting chat room by id: ${err}`
			}
		)
	}
}

module.exports = {
    getChatRoomById,
	getChatRoomByIdPopulatedWithUsers
}