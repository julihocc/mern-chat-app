const User = require("../models/User");
const ChatRoom = require("../models/ChatRoom");

const createGroupConversation = async (_, {emails}) => {

    console.log('createGroupConversation: emails: ', emails)

    const participantIds = await User.find({email: {$in: emails}}).select('_id');

    console.log('createGroupConversation: participantIds: ', participantIds)

    const participants = await User.find({_id: {$in: participantIds}});

    console.log('createGroupConversation: participants: ', participants)

    if (participants.length !== participantIds.length) {
        throw new Error('Some participantIds not found');
    }

    const chatRoom = new ChatRoom({participantIds});
    await chatRoom.save();
    return chatRoom;
};

module.exports = createGroupConversation;