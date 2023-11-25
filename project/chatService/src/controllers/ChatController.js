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

const getMessagesByChatRoomId = async (req, res) => {
	debug("getMessagesByChatRoomId");
    try {
        const chatRoomId = req.body.chatRoomId;
        debug(`chatRoomId: ${chatRoomId}`);
        const messages = await Message.find({chatRoomId}).populate("senderId");
        debug(`messages: ${messages}`);
        res.json(messages);
        res.status(200);
        return messages;
    } catch (err) {
        res.status(500).json(
            {
                message: `Error getting messages by chat room id: ${err}`
            }
        )
    }
}

const saveMessage = async (req, res) => {
	debug("saveMessage");
	// const chatRoomId = req.body.chatRoomId;
	// const senderId = req.body.senderId
	// const body = req.body.body
	// const fileContent = req.body.fileContent
	const {chatRoomId, senderId, body, fileContent} = req.body;
	debug(`chatRoomId: ${JSON.stringify(chatRoomId)}`)
	debug(`senderId: ${senderId}`);
	debug(`body: ${body}`)
	debug(`fileContent: ${fileContent}`)

	const message = new Message({chatRoomId, senderId, body, fileContent});

	try {
		await message.save();

		const chatRoom = await ChatRoom.findById(chatRoomId);
		debug(`chatRoom messages: ${chatRoom.messageIds}`);
		debug(`message: ${message._id}`);
		chatRoom.messageIds.push(message._id);
		await chatRoom.save();
		debug(`chatRoom messages updated: ${chatRoom.messageIds}`);

		res.json(message);
		res.status(200);

		return message;
	} catch (err) {
		res.status(500).json(
            {
                message: `Error saving message: ${err}`
            }
        )
	}


}

module.exports = {
    getChatRoomById,
	getChatRoomByIdPopulatedWithUsers,
	getMessagesByChatRoomId,
	saveMessage
}