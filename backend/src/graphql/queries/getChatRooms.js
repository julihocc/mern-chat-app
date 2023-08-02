const logger = require("../../logger");
const {AuthenticationError} = require("apollo-server-express");
const {getUserFromToken} = require("../utils");
const ChatRoom = require("../../models/ChatRoomModel");
 const getChatRooms = async (parent, args, context) => {
    //logger.info("Calling getChatRooms")
    // //logger.info('context', context)
    const {token} = context;
    //logger.info('token', token)

    if (!token) {
        throw new AuthenticationError('You must be logged in');
    }

    const user = await getUserFromToken(token);
    //logger.info('user', !!user)

    // Check if the user is logged in
    if (!user) {
        throw new AuthenticationError('You must be logged in');
    }

    // Fetch all chat rooms where the user is a participant
    return ChatRoom.find({participantIds: user.id});
};

 module.exports = {getChatRooms};
