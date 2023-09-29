// backend\src\graphql\resolvers\mutations\createChatRoom.js
const User = require("../../models/UserModel");
const ChatRoom = require("../../models/ChatRoomModel");
const {AuthenticationError} = require("apollo-server-express");
const {getUserFromToken} = require("../utils");
const logger = require("../../logger");
const createChatRoom = async (_, {participantIds}, context) => {
    const { token } = context
    const user = await getUserFromToken(token)
    if (!user) {
        throw new AuthenticationError('You are not logged in');
    }

    const participants = await User.find({_id: {$in: participantIds}});

    if (participants.length !== participantIds.length) {
        throw new Error('Some participantIds not found');
    }

    // Check if chatRoom already exists with the same participantIds
    const existingChatRoom = await ChatRoom.findOne({ participantIds: { $all: participantIds } }); // Added this line
    if (existingChatRoom) { // And this line
        throw new Error('ChatRoom with these participants already exists'); // And this line
    } // And this line

    const chatRoom = new ChatRoom({participantIds}); // participantIds instead of participants
    await chatRoom.save();
    return chatRoom;
};

module.exports = {createChatRoom};
