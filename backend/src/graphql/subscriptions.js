// backend\src\graphql\resolvers\subscriptions.js
const logger = require('../logger'); // Import the logger

const subscriptions = {
    newMessage: {
        subscribe: (parent, { chatRoomId }, { pubSub }) => {
            logger.info('loading newMessage'); // Log the info
            logger.info(`newMessage: ${chatRoomId}`); // Log the info
            return pubSub.asyncIterator(`NEW_MESSAGE_${chatRoomId}`);
        }
    },
    // Add this new subscription
    friendRequestUpdated: {
        subscribe: (parent, { userId }, { pubSub }) => {
            logger.info('loading friendRequestUpdated'); // Log the info
            logger.info(`friendRequestUpdated: ${userId}`); // Log the info
            return pubSub.asyncIterator(`FRIEND_REQUEST_UPDATED_${userId}`);
        }
    }
};

module.exports = subscriptions;
