// path: backend/src/graphql/queries/getChatRooms.js
const ChatRoom = require('../../../mongodb/models/ChatRoomModel');
// const logger = require('../../logger')
const {getUserFromToken} = require("../../../utils/authUtils");
const logger = require("../../../utils/logger");

const getChatRooms = async (parent, args, context) => {
    //logger.debug("getChatRooms")
    const {token} = context;
    if (!token) {
        throw new Error('Not authenticated');
    } else {
        logger.debug(`token: ${token}`)
    }
    const currentUser = await getUserFromToken(token)
    if (!currentUser) {
        logger.error("User not found")
        throw new Error('User not found');
    } else {
        logger.debug(`Current user: ${currentUser.username}`)
    }
    const chatRooms = await ChatRoom
        .find({participants: currentUser._id})
        .populate('participants')
        .populate('messages');
    if (!chatRooms) {
        logger.error("Chat rooms not found")
        throw new Error('Chat rooms not found');
    } else {
        logger.debug(`Chat rooms found: ${chatRooms.length}`)
        logger.debug(`Participants by chat room: ${chatRooms.map(chatRoom => chatRoom.participants.toString())}`)
    }
    return chatRooms;
};

module.exports = {getChatRooms};
