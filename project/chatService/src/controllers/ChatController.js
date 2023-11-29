const ChatRoom = require('../models/ChatRoomModel');
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
		res.status(500).json({
			message: `Error getting chat room by id: ${err}`
		})
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
		res.status(500).json({
			message: `Error getting chat room by id: ${err}`
		})
	}
}



const getChatRoomByParticipantIds = async (req, res) => {
	debug("getChatRoomByParticipantIds");
	const participantIds = req.body.participantIds;
	debug(`participantIds: ${participantIds}`);
	try {
		const chatRoom = await ChatRoom.findOne(
			{
				participantIds: {
					$all: participantIds
				}
			}
		)
		res.json(chatRoom);
		res.status(200);
		return chatRoom;
	} catch (err) {
		res.status(500).json({
			message: `Error getting chat room by participant ids: ${err}`
		})
	}
}

const createChatRoomWithParticipantIds = async (req, res) => {
	debug("createChatRoomWithParticipantIds");
	const participantIds = req.body.participantIds;
	debug(`participantIds: ${participantIds}`);
	try {
		const chatRoom = await ChatRoom.create({participantIds});
		await chatRoom.save();
		res.json(chatRoom);
		res.status(200);
		return chatRoom;
	} catch (err) {
		res.status(500).json({
            message: `Error creating chat room with participant ids: ${err}`
        })
	}
}

module.exports = {
	getChatRoomById,
	getChatRoomByIdPopulatedWithUsers,
	getChatRoomByParticipantIds,
	createChatRoomWithParticipantIds
}