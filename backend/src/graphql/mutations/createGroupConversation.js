// backend\src\graphql\resolvers\mutations\createGroupConversation.js
const User = require("../../models/UserModel");
const ChatRoom = require("../../models/ChatRoomModel");
const logger = require("../../logger");
const {AuthenticationError} = require("apollo-server-express");
const {getUserFromToken} = require("../utils");

const createGroupConversation = async (_, {emails}, context) => {

    const { token } = context;
    const user = await getUserFromToken(token);

    if (!user) {
        logger.error('Attempted unauthorized access.'); // log the error
        throw new AuthenticationError('You must be logged in');
    }

    const users = await User.find({email: {$in: emails}});

    if (users.length !== emails.length) {
        throw new Error('Some emails not found');
    }

    const participantIds = users.map(user => user._id);

    const existingChatRoom = await ChatRoom.findOne({ participantIds: { $all: participantIds } });
    if (existingChatRoom) {
        logger.debug(`ChatRoom with these participants already exists`);
        logger.debug(`ChatRoom id: ${existingChatRoom.id}`);
        logger.debug(`ChatRoom participantIds: ${existingChatRoom.participantIds}`);
    }

    const chatRoom = new ChatRoom({participantIds});
    await chatRoom.save();
    return chatRoom;
};

module.exports = {createGroupConversation};
