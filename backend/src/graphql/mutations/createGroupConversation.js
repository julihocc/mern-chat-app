// backend\src\graphql\resolvers\mutations\createGroupConversation.js
const User = require("../../models/UserModel");
const ChatRoom = require("../../models/ChatRoomModel");

const createGroupConversation = async (_, {emails}) => {
    // Get users whose emails are in the provided list
    const users = await User.find({email: {$in: emails}});

    // Check if all emails found a user
    if (users.length !== emails.length) {
        throw new Error('Some emails not found');
    }

    // Extract _id from users to form participantIds
    const participantIds = users.map(user => user._id);

    // Check if chatRoom already exists with the same participantIds
    const existingChatRoom = await ChatRoom.findOne({ participantIds: { $all: participantIds } });
    if (existingChatRoom) {
        throw new Error('ChatRoom with these participants already exists');
    }

    const chatRoom = new ChatRoom({participantIds});
    await chatRoom.save();
    return chatRoom;
};

module.exports = {createGroupConversation};
