// path: backend/src/graphql/queries/getChatRoomsForCurrentUser.js
const ChatRoom = require('../../models/ChatRoomModel');
const logger = require('../../logger')
const {getUserFromToken} = require("../utils");

const getChatRoomsForCurrentUser = async (parent, args, context) => {
    logger.info("getChatRoomsForCurrentUser")
    const { token } = context;
    if (!token) {
        throw new Error('Not authenticated');
    }
    const user = await getUserFromToken(token)
    if (!user) {
        logger.info("User not found")
    }
    logger.info(user)
    const chatRooms = await ChatRoom.find({participantIds: user._id});
    if (!chatRooms) {
        logger.info("Chat rooms not found")
    }
    logger.info(chatRooms)
    return chatRooms;
};

module.exports = {getChatRoomsForCurrentUser};
