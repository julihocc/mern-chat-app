const Message = require("../../../mongodb/models/MessageModel");
const {UserInputError} = require("apollo-server-express");

const getMessagesByChatRoomId = async (parent, args) => {
    const {chatRoomId} = args;
    const messages = await Message.find({chatRoomId});
    if (!messages) {
        throw new UserInputError('Messages not found');
    }
    return messages;
}

module.exports = {getMessagesByChatRoomId}
