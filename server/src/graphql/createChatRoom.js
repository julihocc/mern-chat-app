const User = require("../models/User");
const ChatRoom = require("../models/ChatRoom");

const createChatRoom = async (_, {participantIds}) => {
    const participants = await User.find({_id: {$in: participantIds}});

    if (participants.length !== participantIds.length) {
        throw new Error('Some participantIds not found');
    }

    const chatRoom = new ChatRoom({participants});
    await chatRoom.save();
    return chatRoom;
};

module.exports = createChatRoom;
