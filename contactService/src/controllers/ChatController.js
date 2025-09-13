const {debug} = require("../utils/logger");
const ChatRoom = require('../models/ChatRoomModel');

const createChatRoom = async (req, res) => {
	debug("contactService | createChatRoomWithParticipantIds");
	const {chatRoomId, participantIds} = req.body;
	debug(`participantIds: ${participantIds}`);
	if (participantIds) {
		debug(`Create chat room with participant ids: ${participantIds}`)
		try {
			const chatRoom = await ChatRoom.create({_id:chatRoomId, participantIds});
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
}

module.exports = {
    createChatRoom
}
