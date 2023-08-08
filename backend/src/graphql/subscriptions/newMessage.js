
 const newMessage = {
    subscribe: (parent, { chatRoomId }, { pubSub }) => {
        //logger.info('loading newMessage'); // Log the info
        //logger.info(`newMessage: ${chatRoomId}`); // Log the info
        return pubSub.asyncIterator(`NEW_MESSAGE_${chatRoomId}`);
    }
}

module.exports = {
    newMessage
}
