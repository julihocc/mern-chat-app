const friendRequestUpdated = {
    subscribe: (parent, { userId }, { pubSub }) => {
        //logger.info('loading friendRequestUpdated'); // Log the info
        //logger.info(`friendRequestUpdated: ${userId}`); // Log the info
        return pubSub.asyncIterator(`FRIEND_REQUEST_UPDATED_${userId}`);
    }
}

module.exports = {
    friendRequestUpdated
}
