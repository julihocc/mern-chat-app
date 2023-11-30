const ChatRoom = require('../models/ChatRoomModel');
const {debug} = require("../utils/logger");
require('../models/UserModel');

const getChatRoomById = async (req, res) => {
	debug("getChatRoomById");
	try {
		// const chatRoomId = req.body.chatRoomId;
		const {chatRoomId} = req.query;
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
		// const chatRoomId = req.body.chatRoomId;
		const {chatRoomId} = req.query;
		debug(`chatRoomId: ${chatRoomId}`);
		// FIXME: populate chatRoom with users requires copy user data from auth database
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
	// const participantIds = req.body.participantIds;
	const {participantIds} = req.query;
	debug(`participantIds: ${participantIds}`);
	const participantIdsArray = participantIds.split(",");
	debug(`participantIdsArray: ${participantIdsArray}`);
	try {
		const chatRoom = await ChatRoom.findOne(
			{
				participantIds: {
					$all: participantIdsArray
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