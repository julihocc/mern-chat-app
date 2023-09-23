// path: backend/src/graphql/queries/getChatRoomsForCurrentUser.js
const ChatRoom = require('../../../mongodb/models/ChatRoomModel');
// const logger = require('../../logger')
const {getUserFromToken} = require("../../../utils/authUtils");

const getChatRoomsForCurrentUser = async (parent, args, context) => {
    //logger.debug("getChatRoomsForCurrentUser")
    const { token } = context;
    if (!token) {
        throw new Error('Not authenticated');
    }
    const user = await getUserFromToken(token)
    if (!user) {
        //logger.debug("User not found")
    }
    //logger.debug(user)
    const chatRooms = await ChatRoom.find({participantIds: user._id});
    if (!chatRooms) {
        //logger.debug("Chat rooms not found")
    }
    //logger.debug(chatRooms)
    return chatRooms;
};

module.exports = {getChatRoomsForCurrentUser};
